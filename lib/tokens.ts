import { getVerificationTokenByEmail } from "@/data/verification-token";
import getPrismaClientForRole from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import crypt from "crypto";


export const generateVerificationToken = async (Email: string) => {
    const token = uuidv4();
    const Expires = new Date(new Date().getTime() + 60 * 60 * 1000); //1hr

    const existingToken = await getVerificationTokenByEmail(Email);
    const prisma = getPrismaClientForRole(1);

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

export const generateTwoFactorToken = async (Email: string) => {
    const token = crypt.randomInt(20000).toString();
    const Expires = new Date(new Date().getTime() + 60 * 60 * 1000); //1hr

    const existingToken = await getVerificationTokenByEmail(Email);
    const prisma = getPrismaClientForRole(1);

    if (existingToken) 
    {
      await prisma.$executeRaw`DELETE FROM TwoFactorToken WHERE id = ${existingToken.id}`;
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
      data: {
        Email: Email,
        token: token,
        Expires: Expires,
        createdAt: new Date(), 
      },
    });
    
    return twoFactorToken;
  }