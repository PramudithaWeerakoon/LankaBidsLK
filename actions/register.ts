"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcrypt";
import {db} from "@/lib/db";


export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const valudateFields = RegisterSchema.safeParse(values);

    if (!valudateFields.success) {
        return {error: "Invalid Email or Password"};
    }

    const {email,password,username,role} = valudateFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const findExsistingUser = await db.user.findFirst({
        where: {
            email
        }
    }); 
    if (findExsistingUser) {
        return {error: "User already exists"};
    }

    await db.user.create({
        data: {
            email,
            password: hashedPassword,
            username,
            role
        },
    });
    return {succsess : "User Created Succsessfully"};
};