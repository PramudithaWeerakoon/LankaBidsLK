import getPrismaClientForRole from "@/lib/db";

const prisma = getPrismaClientForRole(1)

interface User {
  UserID: number;
  Username: string;
  PasswordHash: Buffer;
  Salt: Buffer;
  Email: string;
  FullName: string | null;
  RoleID: number;
  CreatedAt: Date;
  UpdatedAt: Date;
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const user = await prisma.$queryRaw<User[]>`SELECT * FROM users WHERE Email = ${email}`;
        console.log("User : ", user);

        if (!user || user.length === 0) {
            return null;
        }

        return user[0];
    } catch (error) {
        console.error("Database error:", error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
};

/*export const getUserByEmail = async (email: string) => {
    try 
    {
        const user = await prisma.users.findUnique({where: {Email: email,},
        });
        console.log("User : ",user);
        return user;
    } 
    catch 
    {
      return null;
    }
  };*/

export const getUserById = async (id: string) => {
    try {
        const user = await prisma.$queryRaw`SELECT * FROM users WHERE UserID = ${id}`;
        console.log("User : ",user);

        if (!user || user.length === 0) {
            return null;
        }

        return user[0];
    } 
    catch (error) 
    {
        throw new Error("Database error");
    } 
    finally 
    {
        await prisma.$disconnect();
    }
};