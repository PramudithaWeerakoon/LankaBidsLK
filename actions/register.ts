"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import getPrismaClientForRole from "@/lib/db";
import bcrypt from "bcrypt";


export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success) {
        return { error: "Invalid input data" };
    }

    const { username, email, password, role } = validateFields.data;
    const PasswordHash = await bcrypt.hash(password, 10);

    const prisma = getPrismaClientForRole(1);

    const existingUser = await prisma.$queryRaw`
        SELECT * FROM users WHERE Email = ${email} OR Username = ${username}
    `;

    if (existingUser.length > 0) 
    {
        return { error: "User with this email or username already exists" };
    }
    
    await prisma.$executeRaw`
        INSERT INTO users (Username, Email,PasswordHash,RoleID) 
        VALUES (${username}, ${email}, ${PasswordHash}, ${role})
    `;

    return { success: "User registered successfully" };

   
};
