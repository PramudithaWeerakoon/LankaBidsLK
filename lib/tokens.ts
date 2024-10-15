import { getVerificationTokenByEmail } from "@/data/verification-token";
import getPrismaClientForRole from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const generateVerificationToken = async (Email: string) => {
    const token = uuidv4();
    const Expires = new Date(new Date().getTime() + 60 * 60 * 1000); //1hr

    const existingToken = await getVerificationTokenByEmail(Email);
    const prisma = getPrismaClientForRole(3);

    if (existingToken) 
    {
      await prisma.$executeRaw`DELETE FROM verificationtoken WHERE id = ${existingToken.id}`;
    }

    const verficationToken = await prisma.verificationToken.create({
      data: {
        Email,
        token,
        Expires,
      }
    });
    
    return verficationToken;
}