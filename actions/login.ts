"use server"; 

import * as z from "zod";
import { SignInSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";

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
    return { info: "Email is not verified , Comfirmation Email Sent"}
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
};