"use server";

import * as z from "zod";
import { SignInSchema } from "@/schemas";



export const login = async (values: z.infer<typeof SignInSchema>) => {
    const valudateFields = SignInSchema.safeParse(values);

    if (!valudateFields.success) {
        return {error: "Invalid Email or Password"};
    }
    
    return {succsess : "Login Succsess"};
};