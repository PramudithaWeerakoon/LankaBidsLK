import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth"
import { SignInSchema } from "@/schemas"
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
 
export default { providers: [
    Credentials ({
        async authorize(credentials) 
        {
            const validateFields = await SignInSchema.safeParse(credentials)

            if (validateFields.success) 
            {
                const {email, password} = validateFields.data;
                const user = await getUserByEmail(email);
                if (!user || !user.PasswordHash) return null;
                const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
                if(isPasswordValid) return user;
            }

            return null;
        }
    })

] } satisfies NextAuthConfig