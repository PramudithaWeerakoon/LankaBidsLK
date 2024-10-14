import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth"
import { SignInSchema } from "@/schemas"
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/data/user";
 
export default { 
    providers: [
    Credentials ({
        async authorize(credentials) {
            const validateFields = await SignInSchema.safeParse(credentials);

            if (validateFields.success) {
                const { email, password } = validateFields.data;
                const user = await getUserByEmail(email);

                if (!user || !user.PasswordHash) return null;

                // Convert PasswordHash to string
                const passwordHashString = user.PasswordHash.toString();

                const isPasswordValid = await bcrypt.compare(password, passwordHashString);

                if (isPasswordValid) 
                    {
                    return {
                        id: user.UserID.toString(),
                        name: user.Username,
                        email: user.Email,
                        role: user.RoleID,
                    };
                }
            }

            return null;
        }
    })

] } satisfies NextAuthConfig