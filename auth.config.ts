import { CredentialsSignin } from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { SignInSchema } from "@/schemas"
import { auth } from "./auth"
 
export default { providers: [
    Credentials ({
        async authorize(credentials) {
            const validateFields = await SignInSchema.safeParse(credentials)
            if (!validateFields.success) 
            {
                const {email, password} = validateFields.data;

                // Check if the user exists in the database based on email
            }
        }
    })

] } satisfies NextAuthConfig