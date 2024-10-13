import { PrismaClient } from '@prisma/client';

const getPrismaClientForRole = (roleId: number): PrismaClient => {
  let databaseUrl = '';

  // Select the appropriate DATABASE_URL based on roleId
  switch (roleId) {
    case 1: // Admin Role
      databaseUrl = process.env.DATABASE_URL_ADMIN!;
      break;
    case 2: // Seller Role
      databaseUrl = process.env.DATABASE_URL_SELLER!;
      break;
    case 3: // Customer Role
      databaseUrl = process.env.DATABASE_URL_CUSTOMER!;
      break;
  }

  // Temporarily set DATABASE_URL for this Prisma client instance
  process.env.DATABASE_URL = databaseUrl;

  // Return a new PrismaClient instance
  return new PrismaClient();
};

export default getPrismaClientForRole;
