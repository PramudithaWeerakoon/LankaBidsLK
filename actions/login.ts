"use server"; 

import * as z from "zod";
import { SignInSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken ,generateTwoFactorToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail , sendTwoFactorEmail } from "@/lib/mail";


export const login = async (values: z.infer<typeof SignInSchema>) => {

  const validatedFields = SignInSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Email or Password" };
  }

  const { email, password } = validatedFields.data;

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

  if(existingUser.TwoFactorEnabled && existingUser.Email)
    {
      const twoFactorToken = await generateTwoFactorToken(existingUser.Email);
      console.log("2FA Token",twoFactorToken);
      await sendTwoFactorEmail(existingUser.Username,twoFactorToken.Email,twoFactorToken.token);
      
      return {twofactor : true}
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