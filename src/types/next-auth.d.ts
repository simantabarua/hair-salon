import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "customer" | "staff" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "customer" | "staff" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "customer" | "staff" | "admin";
  }
}
