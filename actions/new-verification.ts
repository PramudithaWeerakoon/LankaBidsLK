"use server";

import { getUserByEmail } from '@/data/user';
import getPrismaClientForRole from '@/lib/db';
import { getVerificationTokenByToken } from '@/data/verification-token';
import { writeGeneralLog } from '@/utils/logging';  // Import the logging utility

export const newVerification = async (token: string) => {
    const prisma = getPrismaClientForRole(3);

    // Log that the verification process has started
    writeGeneralLog('general.log', 'Verification', 'Token', 'Guest', 'Verify Token', 'Initiated', `Token: ${token}`);

    const exsistingToken = await getVerificationTokenByToken(token);
    
    console.log("Token - Session", token, exsistingToken);

    if (!exsistingToken) {
        writeGeneralLog('general.log', 'Verification', 'Token', 'Guest', 'Verify Token', 'Failed', "Token doesn't exist");
        return { error: "Token Doesn't Exist" };
    }

    const hasExpired = new Date() > exsistingToken.Expires;
    if (hasExpired) {
        writeGeneralLog('general.log', 'Verification', 'Token', exsistingToken.Email, 'Verify Token', 'Failed', 'Token has expired');
        return { error: "Token has expired" };
    }

    const email = exsistingToken.Email;
    console.log(email);

    const exsistingUser = await getUserByEmail(exsistingToken.Email);

    if (!exsistingUser) {
        writeGeneralLog('general.log', 'Verification', 'User', email, 'Verify Email', 'Failed', "Email doesn't exist");
        return { error: "Email Doesn't Exist" };
    }

    // Update user verification status
    await prisma.$executeRaw`UPDATE users SET isVerified = true, updatedAt = ${new Date()} WHERE email = ${exsistingToken.Email}`;
    // Remove the verification token after successful verification
    await prisma.$executeRaw`DELETE FROM verificationtoken WHERE id = ${exsistingToken.id}`;

    writeGeneralLog('general.log', 'Verification', 'User', email, 'Verify Email', 'Success', 'Email verified successfully');

    return { success: "Email Verified" };
}
