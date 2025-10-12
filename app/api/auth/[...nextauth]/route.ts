import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import prisma from '@/lib/db';

export const authOptions: AuthOptions = {
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("No user found with this email. Please sign up.");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Incorrect password. Please try again.");
        }

        if (user.status !== 'ACTIVE') {
          if (user.status === 'SUSPENDED') {
            throw new Error("Your account has been suspended. Please contact support.");
          }
          throw new Error("Your account is not active. Please contact support.");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log(`[JWT CALLBACK] Trigger: ${trigger}`);

      if (user) {
        token.sub = user.id;
        token.role = (user as any).role;
        token.onboardingComplete = (user as any).onboardingComplete;
      }

      if (token.sub) {
        const dbUserWithProfile = await prisma.user.findUnique({
          where: { id: token.sub },
          include: {
            professionalProfile: {
              select: {
                credits: true,
              },
            },
          },
        });

        if (dbUserWithProfile) {
          token.onboardingComplete = dbUserWithProfile.onboardingComplete;
          token.role = dbUserWithProfile.role;
          // Get credits from the profile, defaulting to 0 if no profile exists.
          const newCredits = dbUserWithProfile.professionalProfile?.credits ?? 0;
          console.log(`[JWT CALLBACK] Fetched credits from DB: ${token.credits}`);
          if (newCredits > (token.credits ?? 0) || trigger !== 'update' || !session?.creditsUpdated) {
            token.credits = newCredits;
          }
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
        session.user.onboardingComplete = token.onboardingComplete;
        session.user.credits = token.credits;
        console.log(`[SESSION CALLBACK] Final session credits: ${session.user.credits}`);

      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };