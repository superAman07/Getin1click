import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string | null;
      onboardingComplete?: boolean;
      credits?: number;
      phoneNumber?: string | null;
      address?: string | null; 
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    onboardingComplete?: boolean;
    credits?: number;
    phoneNumber?: string | null;
    address?: string | null;
  }
}     
