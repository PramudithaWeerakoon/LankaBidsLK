import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {PrismaAdapter} from "@auth/prisma-adapter";
import getPrismaClientForRole from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

const prisma = getPrismaClientForRole(3);


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  callbacks: {
    async signIn({user, account})
    {
      if(account?.provider === "credentials") return true;

      const existingUser = await getUserByEmail(user.email);
      console.log("Existing user", existingUser);
      // If user is not verified, do not allow login
      if(!existingUser?.IsVerified) return false;

     
             
      if(existingUser?.isTwoFactorEnabled)
      {

        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.UserID);
        if(!twoFactorConfirmation) return false;

        await prisma.$queryRaw`
        DELETE FROM TwoFactorConfirmation
      WHERE id = ${twoFactorConfirmation.id}
      `;

      }
      

  
      return true;
    },
    async session({session, token})
    {
      if(token.sub && session.user)
        {
          session.user.id = token.sub;
        }

        if(token.role && session.user)
        {
          session.user.role = token.role;
        }

      // console.log("Session jwt", token);
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