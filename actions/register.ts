"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { createConnection } from "@/lib/db";
import bcrypt from "bcrypt";
import { FieldPacket, ResultSetHeader } from "mysql2/promise";
import { setCookie } from 'cookies-next';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Invalid input data" };
    }

    const { username, email, password, role } = values;

    try {
        // Map roles to roleId
        const roleId = role === "seller" ? 2 : 3; // Assuming 'seller' maps to roleId 2 and 'bidder' maps to roleId 3
        const connection = await createConnection(roleId); // Create a database connection

        // Check if the user already exists based on email
        const [existingEmail]: [any[], FieldPacket[]] = await connection.execute(
            `SELECT email FROM users WHERE email = ?`,
            [email]
        );

        if (existingEmail.length > 0) {
            return { error: "User with this email already exists" }; // Email already registered
        }

        // Check if the user already exists based on username
        const [existingUsername]: [any[], FieldPacket[]] = await connection.execute(
            `SELECT username FROM users WHERE username = ?`,
            [username]
        );

        if (existingUsername.length > 0) {
            return { error: "Username already exists" }; // Username already registered
        }

        // Hash the password before saving
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert the user into the database using roleId
        const [result]: [ResultSetHeader, FieldPacket[]] = await connection.execute(
            `INSERT INTO users (username, email, passwordHash, roleID) VALUES (?, ?, ?, ?)`,
            [username, email, passwordHash, roleId]
        );

        // Check if the insert was successful
        if (result.affectedRows > 0) {
            // Set roleId and login status in cookies
            const userID = result.insertId;
            setCookie('roleId', roleId, { maxAge: 60 * 60 * 24 * 7 });
            setCookie('isLoggedIn', 'true', { maxAge: 60 * 60 * 24 * 7 });

            return { success: "Registration successful", isLoggedIn: true, roleId, userID };
        } else {
            return { error: "Registration failed" };
        }
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "An error occurred during registration" };
    }
};
