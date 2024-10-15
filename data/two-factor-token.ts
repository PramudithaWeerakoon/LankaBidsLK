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

export const getTwoFactorTokenByEmail = async (email :string) => {
    try
    {
        const twoFactorToken = await prisma.$queryRaw`SELECT * FROM TwoFactorToken WHERE Email = ${email} LIMIT 1`;
        return twoFactorToken;
    }
    catch
    {
        return null;
    }
};



