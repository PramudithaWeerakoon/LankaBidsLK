// lib/db.ts
import mysql, { Connection } from 'mysql2/promise';

// Connection variable
let connection: Connection | null = null;

// Function to create and return the connection
export const createConnection = async (): Promise<Connection> => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,        // Your MySQL host
      user: process.env.MYSQL_USER,        // Your MySQL username
      password: process.env.MYSQL_PASSWORD,// Your MySQL password
      database: process.env.MYSQL_DATABASE // Your MySQL database
    });

    // Handle connection errors and reconnections
    connection.on('error', async (err) => {
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        connection = await createConnection();
      } else {
        throw err;
      }
    });
  }
  return connection;
};