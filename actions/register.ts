"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas"; // Your validation schema
import { createConnection } from "@/lib/db"; // Your function to create a DB connection
import bcrypt from "bcrypt";
import { FieldPacket, ResultSetHeader } from "mysql2/promise"; // Importing the FieldPacket type
import { setCookie } from 'cookies-next'; // Importing setCookie


export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Invalid input data" };
    }

    const { username, email, password, role } = values;

    try {
        // Map roles to roleId
        const roleId = role === "seller" ? 2 : 3; // Assuming 'seller' maps to roleId 2 and 'bidder' maps to roleId 3
        const connection = await createConnection(roleId); // Create a database connection based on the role

        // Hash the password before saving
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert the user into the database using roleId instead of role
        const [result]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
            `INSERT INTO users (username, email, passwordHash, roleID) VALUES (?, ?, ?, ?)`,
            [username, email, passwordHash, roleId] // Save the roleId here
        );

        // Check if the insert was successful
        if (result.affectedRows > 0) {
            // Set roleId in cookies
            setCookie('roleId', roleId, { maxAge: 60 * 60 * 24 * 7 }); // Cookie expires in 7 days
            setCookie('isLoggedIn', 'true', { maxAge: 60 * 60 * 24 * 7 });

            // Return success message and set isLoggedIn to true
            return { success: "Registration successful", isLoggedIn: true, roleId };
        } else {
            return { error: "Registration failed" };
        }
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "An error occurred during registration" };
    }
};