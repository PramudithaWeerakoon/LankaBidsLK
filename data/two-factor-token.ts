import getPrismaClientForRole from "@/lib/db";

const prisma = getPrismaClientForRole(1);

export const getTwoFactorTokenByToken = async (token :string) => {
    try
    {
        const twoFactorToken = await prisma.$queryRaw`SELECT * FROM TwoFactorToken WHERE token = ${token}`;
    

        return twoFactorToken;
    }
    catch
    {
        return null;
    }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await prisma.twoFactorToken.findFirst({
            where: { Email: email } 
        });

        console.log("2FA Token Before", twoFactorToken);

        return twoFactorToken;
    } catch (error) {
        console.error("Error fetching 2FA token by email:", error);
        return null;
    }
};
