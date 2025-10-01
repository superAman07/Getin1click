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

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    // session({ session, token }) {
    //   if (session.user && token.sub) {
    //     session.user.id = token.sub as string;
    //     session.user.role = (token as JWT).role ?? null;
    //   }
    //   return session;
    // },
    // jwt({ token, user }) {
    //   if (user) {
    //     token.role = (user as any).role ?? token.role;
    //     token.onboardingComplete = (user as any).onboardingComplete;
    //   }
    //   return token;
    async jwt({ token, user, trigger, session }) {
      // 1. On initial sign-in, persist the user data to the token.
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.onboardingComplete = user.onboardingComplete;
      }

      // 2. When updateSession() is called from the client, this runs.
      if (trigger === "update") {
        // Refetch the user from the database to get the latest data.
        const dbUser = await prisma.user.findUnique({ where: { id: token.sub } });
        if (dbUser) {
          // Update the token with the fresh data.
          token.role = dbUser.role;
          token.onboardingComplete = dbUser.onboardingComplete;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role;
        session.user.onboardingComplete = token.onboardingComplete;
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