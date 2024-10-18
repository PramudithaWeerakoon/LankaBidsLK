import getPrismaClientForRole from "@/lib/db";
import { writeGeneralLog } from "@/utils/logging"; // Import the logging utility

const prisma = getPrismaClientForRole(1);

export const getTwoFactorConfirmationByUserId = async (userId: number) => {
    try {
        const getTwoFactorConfirmation: any[] = await prisma.$queryRaw`
            SELECT * FROM TwoFactorConfirmation WHERE UserId = ${userId}
        `;

        if (!getTwoFactorConfirmation || getTwoFactorConfirmation.length === 0) {
            writeGeneralLog('general.log', 'Fetch', 'TwoFactorConfirmation', 'System', 'Fetch', 'Failure', `No two-factor confirmation found for userId: ${userId}`);
            return null;
        }

        writeGeneralLog('general.log', 'Fetch', 'TwoFactorConfirmation', 'System', 'Fetch', 'Success', `Two-factor confirmation fetched successfully for userId: ${userId}`);
        return getTwoFactorConfirmation;
    } catch (error: any) {
        writeGeneralLog('general.log', 'Fetch', 'TwoFactorConfirmation', 'System', 'Fetch', 'Failure', `Error fetching two-factor confirmation for userId: ${userId}. Error: ${error.message}`);
        return null;
    }
};
