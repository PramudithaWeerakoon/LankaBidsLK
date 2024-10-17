"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import getPrismaClientForRole from '@/lib/db';
import { getCurrentUser} from "@/lib/auth";



export const settings = async (values: z.infer<typeof SettingsSchema>) => {

    console.log("values",values);
    const validatedFields = SettingsSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid input data" };
    }

    const {username,email,isTwoFactorEnabled,role } = validatedFields.data;
    
    const user = await getCurrentUser();
    const prisma = getPrismaClientForRole(3);

    if(!user) 
    {
       return { error: "Unauthorized" };
    }

    const dbUser = await getUserByEmail(user.email);
    const roleInt = parseInt(role, 10); 

    await prisma.$executeRaw`UPDATE users 
        SET Username = ${username}, 
            Email = ${email}, 
            IsTwoFactorEnabled = ${isTwoFactorEnabled}, 
            RoleID = ${roleInt} 
        WHERE Email = ${dbUser?.Email}`;

    return { success: "Settings Updated Successfully" };
}