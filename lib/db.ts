import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load the appropriate environment file based on the role ID
function loadEnv(roleId: number) {
    let envPath = '';

    switch (roleId) {
        case 1:
            envPath = path.resolve(process.cwd(), '.env.admin');
            break;
        case 4:
            envPath = path.resolve(process.cwd(), '.env.auditor');
            break;
        case 3:
            envPath = path.resolve(process.cwd(), '.env.customer');
            break;
        case 2:
            envPath = path.resolve(process.cwd(), '.env.seller');
            break;
        default:
            throw new Error('Invalid role');
    }

    // Load the specified environment variables
    dotenv.config({ path: envPath });
}

// Connect to the MySQL database using the loaded environment variables
export async function connectToDatabase(roleId: number) {
    loadEnv(roleId); // Load the environment for the given role

    // Create a connection to the database
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    return connection; // Return the connection object
}
