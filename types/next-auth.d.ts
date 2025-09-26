// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      /** The user's id. */
      id: string;
      /** Optional: role or other custom fields from your DB */
      role?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** Persist role in JWT */
    role?: string | null;
  }
}
