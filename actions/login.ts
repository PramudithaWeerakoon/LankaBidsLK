"use server"; // Enables server actions

import * as z from "zod";
import { SignInSchema } from "@/schemas";
import { createConnection } from "@/lib/db"; // Import the database connection function
import bcrypt from 'bcryptjs'; // For comparing passwords

// Server action function to handle login
export const login = async (values: z.infer<typeof SignInSchema>) => {
  // Validate the form input using Zod schema
  const validationResult = SignInSchema.safeParse(values);

  if (!validationResult.success) {
    return { error: "Invalid Email or Password" };
  }

  const { email, password } = values;

  try {
    // Create a connection to the database
    const connection = await createConnection(1); // Default to admin for connection
    
    // Query the database to check if the user exists
    const [rows] = await connection.execute(
      'SELECT UserID, RoleID, PasswordHash FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const user = rows[0] as { UserID: number; RoleID: number; PasswordHash: Buffer };

      // Convert PasswordHash (Buffer) to a string before comparing
      const hashedPassword = user.PasswordHash.toString('utf-8');

      // Compare the hashed password with the input password
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        // Password matches, check the role and return accordingly
        const roleId = user.RoleID;

        await connection.end();

        return { success: true, role: roleId }; // Return role and success message
      } else {
        // Password doesn't match
        await connection.end();
        return { error: "Invalid Email or Password" };
      }
    } else {
      // No user found
      await connection.end();
      return { error: "Invalid Email or Password" };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return { error: "An error occurred during login." };
  }
};
