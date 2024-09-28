// app/api/login/route.ts

import { createConnection } from '../../../lib/db'; // Correct import for the database connection
import { NextResponse } from 'next/server';

export const POST = async (request: Request): Promise<Response> => {
  const { email, password } = await request.json(); // Get email and password from request body

  try {
    const connection = await createConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM user WHERE email = ? AND password = ?',
      [email, password]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      // User found, return success response
      return NextResponse.json({ message: 'Login successful' }, { status: 200 });
    } else {
      // User not found, return error response
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
};