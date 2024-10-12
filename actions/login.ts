"use server"; 

import * as z from "zod";
import { SignInSchema } from "@/schemas";
import { createConnection } from "@/lib/db"; 
import bcrypt from 'bcryptjs'; 

export const login = async (values: z.infer<typeof SignInSchema>) => {

  const validationResult = SignInSchema.safeParse(values);

  if (!validationResult.success) {
    return { error: "Invalid Email or Password" };
  }

  const { email, password } = values;

  try {

    const connection = await createConnection(1); 
    

    const [rows] = await connection.execute(
      'SELECT UserID, RoleID, PasswordHash FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0] as { UserID: number; RoleID: number; PasswordHash: Buffer };


      const hashedPassword = user.PasswordHash.toString('utf-8');


      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {

        const roleId = user.RoleID;

        await connection.end();

        return { success: true, role: roleId }; 
      } 
      else 
      {
        await connection.end();
        return { error: "Invalid Email or Password" };
      }
    } 
    else
     {
      await connection.end();
      return { error: "Invalid Email or Password" };
    }
  } 
  catch (error) 
  {
    console.error("Error during login:", error);
    return { error: "An error occurred during login." };
  }
};