import getPrismaClientForRole from "@/lib/db";
import { writeGeneralLog } from "@/utils/logging"; // Import the logging utility

const prisma = getPrismaClientForRole(1);

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await prisma.$queryRaw`
            SELECT * FROM TwoFactorToken WHERE token = ${token}
        `;

        if (!twoFactorToken) {
            writeGeneralLog('general.log', 'Fetch', 'TwoFactorToken', 'System', 'Fetch', 'Failure', `No 2FA token found for token: ${token}`);
            return null;
        }

        writeGeneralLog('general.log', 'Fetch', 'TwoFactorToken', 'System', 'Fetch', 'Success', `2FA token fetched successfully for token: ${token}`);
        return twoFactorToken;
    } catch (error: any) {
        writeGeneralLog('general.log', 'Fetch', 'TwoFactorToken', 'System', 'Fetch', 'Failure', `Error fetching 2FA token for token: ${token}. Error: ${error.message}`);
        return null;
    }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await prisma.twoFactorToken.findFirst({
            where: { Email: email }
        });

        if (!twoFactorToken) {
            writeGeneralLog('general.log', 'Fetch', 'TwoFactorToken', 'System', 'Fetch', 'Failure', `No 2FA token found for email: ${email}`);
            return null;
        }

        writeGeneralLog('general.log', 'Fetch', 'TwoFactorToken', 'System', 'Fetch', 'Success', `2FA token fetched successfully for email: ${email}`);
        return twoFactorToken;
    } catch (error: any) {
        writeGeneralLog('general.log', 'Fetch', 'TwoFactorToken', 'System', 'Fetch', 'Failure', `Error fetching 2FA token for email: ${email}. Error: ${error.message}`);
        console.error("Error fetching 2FA token by email:", error);
        return null;
    }
};
