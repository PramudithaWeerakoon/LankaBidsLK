"use server"; 

import * as z from "zod";
import { SignInSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import getPrismaClientForRole from '@/lib/db';
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { writeGeneralLog } from '@/utils/logging';  // Import the logging utility

export const login = async (values: z.infer<typeof SignInSchema>) => {

  const validatedFields = SignInSchema.safeParse(values);
  const prisma = getPrismaClientForRole(3);

  if (!validatedFields.success) {
    writeGeneralLog('general.log', 'Login', 'Authentication', 'Guest', 'Validate Login', 'Failed', 'Invalid Email or Password');
    return { error: "Invalid Email or Password" };
  }

  const { email, password, code } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.Email || !existingUser.PasswordHash) {
    writeGeneralLog('general.log', 'Login', 'Authentication', email, 'Account Check', 'Failed', "Account Doesn't Exist");
    return { error: "Account Doesn't Exsist" };
  }

  if (!existingUser.IsVerified) {
    const verificationToken = await generateVerificationToken(existingUser.Email);
    await sendVerificationEmail(existingUser.Username, verificationToken.Email, verificationToken.token);
    writeGeneralLog('general.log', 'Login', 'Authentication', email, 'Verify Email', 'Failed', 'Email not verified, confirmation email sent');
    return { info: "Email is not verified, Confirmation Email Sent" };
  }

  if (existingUser.IsTwoFactorEnabled && existingUser.Email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.Email);

      if (!twoFactorToken) {
        writeGeneralLog('general.log', 'Login', 'Authentication', email, '2FA Code', 'Failed', 'No Code Provided');
        return { error: "No Code" };
      }

      if (twoFactorToken.token !== code) {
        writeGeneralLog('general.log', 'Login', 'Authentication', email, '2FA Code', 'Failed', 'Invalid Code');
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.Expires) < new Date();

      if (hasExpired) {
        writeGeneralLog('general.log', 'Login', 'Authentication', email, '2FA Code', 'Failed', 'Code Expired');
        return { error: "Code Expired" };
      }

      await prisma.$queryRaw`DELETE FROM TwoFactorToken WHERE id = ${twoFactorToken.id}`;
      const exsistingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.UserID);

      if (exsistingConfirmation) {
        await prisma.$queryRaw`DELETE FROM TwoFactorConfirmation WHERE userId = ${existingUser.UserID}`;
      }

      await prisma.$queryRaw`INSERT INTO TwoFactorConfirmation (userId) VALUES (${existingUser.UserID})`;
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.Email);
      await sendTwoFactorEmail(existingUser.Username, twoFactorToken.Email, twoFactorToken.token);
      writeGeneralLog('general.log', 'Login', 'Authentication', email, '2FA Code', 'Requested', 'Two-factor code sent');
      return { twoFactor: true };
    }
  }
  writeGeneralLog('general.log', 'Login', 'Authentication', email, 'SignIn', 'Success', 'User signed in successfully');
  try {
    await signIn("credentials", { email, password, redirectTo: DEFAULT_LOGIN_REDIRECT });
    writeGeneralLog('general.log', 'Login', 'Authentication', email, 'SignIn', 'Success', 'User signed in successfully');
  } catch (error) {
    if (error instanceof AuthError) {
      writeGeneralLog('general.log', 'Login', 'Authentication', email, 'SignIn', 'Failed', error.type === "CredentialsSignin" ? 'Invalid credentials!' : 'Something went wrong!');
      switch (error.type) {
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
