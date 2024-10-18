"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import getPrismaClientForRole from "@/lib/db";
import bcrypt from "bcrypt";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { writeGeneralLog } from "@/utils/logging"; // Import the general logging utility

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);
  writeGeneralLog('general.log', "Create", "User Registration", "guest", "Validate Input", "Info", "Validating input data");

  if (!validateFields.success) {
    writeGeneralLog('general.log', "Create", "User Registration", "guest", "Validate Input", "Failure", "Invalid input data");
    return { error: "Invalid input data" };
  }

  const { username, email, password, role, isTwoFactorEnabled } = validateFields.data;
  const PasswordHash = await bcrypt.hash(password, 10);
  
  const prisma = getPrismaClientForRole(3); // Customer Role ID

  const existingUser = await prisma.$queryRaw`
      SELECT * FROM users WHERE Email = ${email} OR Username = ${username}
  `;
  writeGeneralLog('general.log', "Create", "User Registration", email, "Check Existing User", "Info", "Checking if user already exists");

  if (existingUser.length > 0) {
    writeGeneralLog('general.log', "Create", "User Registration", email, "Check Existing User", "Failure", "User with this email or username already exists");
    return { error: "User with this email or username already exists" };
  }

  await prisma.$executeRaw`
      INSERT INTO users (Username, Email, PasswordHash, RoleID, IsTwoFactorEnabled) 
      VALUES (${username}, ${email}, ${PasswordHash}, ${role}, ${isTwoFactorEnabled})
  `;
  writeGeneralLog('general.log', "Create", "User Registration", email, "Insert User", "Success", "User created successfully");

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(username, verificationToken.Email, verificationToken.token);
  writeGeneralLog('general.log', "Create", "User Registration", email, "Send Verification Email", "Success", "Verification email sent");

  return { success: "Confirmation Email Sent" };
};
