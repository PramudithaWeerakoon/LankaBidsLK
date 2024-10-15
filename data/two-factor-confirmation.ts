import getPrismaClientForRole from "@/lib/db";

const prisma = getPrismaClientForRole(1);

export const getTwoFactorConfirmationByUserId = async (userId :number) => 
{
    try
    {
        const getTwoFactorConfirmation = await prisma.$queryRaw`SELECT * FROM TwoFactorConfirmation WHERE UserId = ${userId}`;

        return getTwoFactorConfirmation;
    }
    catch
    {
        return null;
    }
}