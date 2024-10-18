"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import getPrismaClientForRole from '@/lib/db';
import { getCurrentUser} from "@/lib/auth";
import { writeLogproduct } from "@/utils/logging";



export const settings = async (values: z.infer<typeof SettingsSchema>) => {

    console.log("values",values);
    const validatedFields = SettingsSchema.safeParse(values);
    const user = await getCurrentUser();
    const userType = user?.role === 3 ? 'Customer' : 'Seller';


    if (!validatedFields.success) {
        writeLogproduct('settings.log', userType, user.email!, 'Update', 'Failure', `Validation Error: ${validatedFields.error}`); // Log the error
        return { error: "Invalid input data" };
    }

    const {username,email,isTwoFactorEnabled,role } = validatedFields.data;
    
    const prisma = getPrismaClientForRole(3);

    if(!user) 
    {
        writeLogproduct('settings.log', 'Guest', '0', 'Update', 'Failure', `Unauthorized`); // Log the error
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

        writeLogproduct('settings.log', userType, user.email!, 'Update', 'Success', `Settings updated successfully`); // Log the success

    return { success: "Settings Updated Successfully" };
}