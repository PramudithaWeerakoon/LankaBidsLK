import getPrismaClientForRole from "@/lib/db";
import { writeGeneralLog } from "@/utils/logging"; // Import the logging utility

const prisma = getPrismaClientForRole(1);

export const getVerificationTokenByToken = async (token: string) => {
    console.log("Method called");
    try {
        const verificationToken = await prisma.$queryRaw`
            SELECT * FROM verificationToken WHERE token = ${token}
        `;

        if (!verificationToken || verificationToken.length === 0) {
            writeGeneralLog('general.log', 'Fetch', 'VerificationToken', token, 'Fetch', 'Failure', 'No verification token found with the provided token.');
            return null;
        }

        writeGeneralLog('general.log', 'Fetch', 'VerificationToken', token, 'Fetch', 'Success', 'Verification token found successfully.');
        return verificationToken[0] || null;
    } catch (error: any) {
        writeGeneralLog('general.log', 'Fetch', 'VerificationToken', token, 'Fetch', 'Failure', `Database error: ${error.message}`);
        return null;
    }
};

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await prisma.$queryRaw`
            SELECT * FROM verificationToken WHERE Email = ${email}
        `;
        
        if (!verificationToken || verificationToken.length === 0) {
            writeGeneralLog('general.log', 'Fetch', 'VerificationToken', email, 'Fetch', 'Failure', 'No verification token found with the provided email.');
            return null;
        }

        writeGeneralLog('general.log', 'Fetch', 'VerificationToken', email, 'Fetch', 'Success', 'Verification token found successfully.');
        return verificationToken[0] || null;
    } catch (error: any) {
        writeGeneralLog('general.log', 'Fetch', 'VerificationToken', email, 'Fetch', 'Failure', `Database error: ${error.message}`);
        return null;
    }
};
