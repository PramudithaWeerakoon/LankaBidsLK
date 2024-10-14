import { getVerificationTokenByEmail } from "@/data/verification-token";
import getPrismaClientForRole from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    const Expires = new Date(new Date().getTime() + 60 * 60 * 1000); //1hr

    const existingToken = await getVerificationTokenByEmail(email);
    const prisma = getPrismaClientForRole(3);

    if (existingToken) 
    {
      await prisma.$executeRaw`DELETE FROM verificationtoken WHERE id = ${existingToken.id}`;
    }

    const verificationToken = await prisma.$executeRaw`
      INSERT INTO verificationtoken (email, token, expires)
      VALUES (${email}, ${token}, ${Expires})
    `;

    return verificationToken;
}