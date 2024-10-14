import getPrismaClientForRole from "@/lib/db";

const prisma = getPrismaClientForRole(1)

export const getVerificationTokenByToken = async (
    token: string
) => {
    try {
        const verificationToken = await prisma.$queryRaw`
            SELECT * FROM verificationToken WHERE token = ${token}
        `;

        return verificationToken[0] || null;
    } catch {
        return null;
    }
}

export const getVerificationTokenByEmail = async (
    email: string
) => {
    try {
        const verificationToken = await prisma.$queryRaw`
            SELECT * FROM verificationToken WHERE Email = ${email}
        `;

        return verificationToken[0] || null;
    } catch {
        return null;
    }
}