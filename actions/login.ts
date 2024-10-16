"use server"; 

import * as z from "zod";
import { SignInSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken ,generateTwoFactorToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail , sendTwoFactorEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import getPrismaClientForRole from '@/lib/db';
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";


export const login = async (values: z.infer<typeof SignInSchema>) => {

  const validatedFields = SignInSchema.safeParse(values);
  const prisma = getPrismaClientForRole(3);

  if (!validatedFields.success) {
    return { error: "Invalid Email or Password" };
  }

  const { email, password , code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);


  if(!existingUser || !existingUser.Email || !existingUser.PasswordHash) 
  {
    return { error: "Account Doesn't Exsist" }
  }

  if(!existingUser.IsVerified) 
  {
    const verificationToken = await generateVerificationToken(existingUser.Email);
    await sendVerificationEmail(existingUser.Username,verificationToken.Email,verificationToken.token);
    return { info: "Email is not verified , Comfirmation Email Sent"}
  }

  if(existingUser.IsTwoFactorEnabled && existingUser.Email)
  {
    if(code)
    {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.Email);
      //console.log("2FA Token After",twoFactorToken);

      if(!twoFactorToken)
      {
        return { error: "No Code" }
      }

      console.log("2FA Token",twoFactorToken.token);

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.Expires) < new Date();

      if(hasExpired)
      {
        return { error: "Code Expired" }
      }

      await prisma.$queryRaw`DELETE FROM TwoFactorToken WHERE id = ${twoFactorToken.id}`;

      const exsistingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.UserID);

      if(exsistingConfirmation)
      {
        await prisma.$queryRaw`DELETE FROM TwoFactorConfirmation WHERE userId = ${existingUser.UserID}`;
      }

      await prisma.$queryRaw`INSERT INTO TwoFactorConfirmation (userId) VALUES (${existingUser.UserID})`;
    }
    else
    {
    const twoFactorToken = await generateTwoFactorToken(existingUser.Email);
    //console.log("2FA Token",twoFactorToken);
    await sendTwoFactorEmail(existingUser.Username,twoFactorToken.Email,twoFactorToken.token);
    return { twoFactor: true };
    }
  }

  try 
  {
    await signIn("credentials", {email, password, redirectTo: DEFAULT_LOGIN_REDIRECT});
   
  } 
  catch (error) 
  {
    if (error instanceof AuthError) 
      {
      switch (error.type) 
      {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" }
        default:
          return { error: "Something went wrong!" }
      }
    }
    throw error;
  }

  return null;
};