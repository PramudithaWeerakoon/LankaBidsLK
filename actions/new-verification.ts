"use server";

import { getUserByEmail } from '@/data/user';
import getPrismaClientForRole from '@/lib/db';
import { getVerificationTokenByToken } from '@/data/verification-token';



export const newVerification = async (token: string) => {
    const prisma = getPrismaClientForRole(3);
    const exsistingToken = await getVerificationTokenByToken(token);
    
    console.log("Token - Session" , token, exsistingToken);

    if(!exsistingToken)
    {
        return { error: "Token Doesn't Exsist" };
    }

    const hasExpired = new Date() > exsistingToken.Expires;
    if(hasExpired)
    {
        return { error: "Token has expired" };
    }


    const email = exsistingToken.Email;
    console.log(email);

    const exsistingUser = await getUserByEmail(exsistingToken.Email);
    //console.log(exsistingUser);

    if(!exsistingUser)
    {
        return { error: "Email Doesn't Exsist" };
    }

    await prisma.$executeRaw`UPDATE users SET isVerified = true, updatedAt = ${new Date()} WHERE email = ${exsistingToken.Email}`;
    await prisma.$executeRaw`DELETE FROM verificationtoken WHERE id = ${exsistingToken.id}`;

    return { success: "Email Verified" };
}

