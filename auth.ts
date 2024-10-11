import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import mysql from "mysql2/promise";

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your-username',
  password: 'your-password',
  database: 'your-database'
});

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async signIn(user: any, account: any, profile: any) {
      
      // Implement your sign-in logic using the MySQL connection pool
      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [user.email]);
        if (rows.length > 0) {
          // User exists
          return true;
        } else {
          // User does not exist
          return false;
        }
      } finally {
        connection.release();
      }
    },
    async session(session: any, user: any) {
      // Implement your session logic using the MySQL connection pool
      return session;
    },
    async jwt(token: any, user: any) {
      // Implement your JWT logic using the MySQL connection pool
      return token;
    }
  }
});