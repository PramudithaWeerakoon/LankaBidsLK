import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {PrismaAdapter} from "@auth/prisma-adapter";
import getPrismaClientForRole from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { use } from "react";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async session({session, token})
    {

      console.log("Session jwt", token);
      if(token.sub && session.user)
        {
          session.user.id = token.sub;
        }

      return session;
    },

    async jwt({token}) 
    {
      if(!token.email) return token;
      const user = await getUserByEmail(token.email);
      if(!user) return token;
      token.role = user.RoleID;
      return token;
    }},
  adapter: PrismaAdapter(getPrismaClientForRole(1)),
  session: {strategy : "jwt"},
  ...authConfig
});