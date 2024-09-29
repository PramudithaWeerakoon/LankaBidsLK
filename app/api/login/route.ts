import { createConnection } from '../../../lib/db'; // Correct import for the database connection
import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2/promise'; // Import RowDataPacket for proper typing

export const POST = async (request: Request): Promise<Response> => {
  const { email, password } = await request.json(); // Get email and password from request body

  try {
    const connection = await createConnection();
    
    // Cast rows as RowDataPacket[] to avoid the type error
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE Email = ? AND PasswordHash = ?',
      [email, password]
    );

    if (rows.length > 0) {
      const user = rows[0]; // assuming rows[0] is the logged-in user
      const roleID = user.RoleID; // Get RoleID from the database

      console.log('User logged in:', roleID, user);

      // Return the user's RoleID and other necessary data for the dynamic header
      return NextResponse.json(
        { message: 'Login successful', roleID, user },
        { status: 200 }
      );
    } else {
      // User not found, return error response
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};