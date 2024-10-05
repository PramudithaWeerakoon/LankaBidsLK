import mysql, { Connection } from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Function to create and return the connection based on user role
export const createConnection = async (roleId: number): Promise<Connection> => {
  let user: string;
  let password: string;

  switch (roleId) {
    case 1:
      user = process.env.ADMIN_USER!;
      password = process.env.ADMIN_PASSWORD!;
      break;
    case 2:
      user = process.env.SELLER_USER!;
      password = process.env.SELLER_PASSWORD!;
      break;
    case 3:
      user = process.env.CUSTOMER_USER!;
      password = process.env.CUSTOMER_PASSWORD!;
      break;
    default:
      throw new Error('Invalid role ID');
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: user,
    password: password,
    database: process.env.DB_NAME
  });

  // Handle connection errors and reconnections
  connection.on('error', async (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      await createConnection(roleId);
    } else {
      throw err;
    }
  });

  return connection;
};