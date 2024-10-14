import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {PrismaAdapter} from "@auth/prisma-adapter";
import getPrismaClientForRole from "@/lib/db";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(getPrismaClientForRole(1)),
  session: {strategy : "jwt"},
  ...authConfig
});