"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import getPrismaClientForRole from '@/lib/db';
import { getCurrentUser } from "@/lib/auth";
import { writeGeneralLog } from "@/utils/logging"; // Import logging utility

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    console.log("values", values);
    
    // Validate the input fields
    const validatedFields = SettingsSchema.safeParse(values);
    const user = await getCurrentUser();
    const userType = user?.role === 3 ? 'Customer' : 'Seller'; // Determine user type based on role

    if (!validatedFields.success) {
        writeGeneralLog('general.log', userType, user?.email ?? 'Guest', 'Update', 'Failure', `Validation Error: ${validatedFields.error.message}`); // Log validation error
        return { error: "Invalid input data" };
    }

    const { username, email, isTwoFactorEnabled, role } = validatedFields.data;
    
    const prisma = getPrismaClientForRole(3);

    if (!user) {
        writeGeneralLog('general.log', 'Guest', '0', 'Update', 'Failure', 'Unauthorized'); // Log unauthorized access
        return { error: "Unauthorized" };
    }

    const dbUser = user.email ? await getUserByEmail(user.email) : null;
    const roleInt = parseInt(role, 10); // Convert role to integer

    try {
        // Update user settings in the database
        await prisma.$executeRaw`
            UPDATE users 
            SET Username = ${username}, 
                Email = ${email}, 
                IsTwoFactorEnabled = ${isTwoFactorEnabled}, 
                RoleID = ${roleInt} 
            WHERE Email = ${dbUser?.Email};
        `;

        writeGeneralLog('general.log', userType, user.email!, 'Update', 'Success', 'Settings updated successfully'); // Log successful update
        return { success: "Settings Updated Successfully" };
    } catch (error: any) {
        writeGeneralLog('general.log', userType, user.email!, 'Update', 'Failure', `Error: ${error.message || error}`); // Log failure with error message
        console.error('Error updating settings:', error.message || error);
        return { error: "Failed to update settings. Please try again later." };
    } finally {
        await prisma.$disconnect(); // Disconnect from the database
    }
};
