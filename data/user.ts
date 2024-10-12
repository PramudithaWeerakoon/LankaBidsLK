import { createConnection } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
    const connection = await createConnection(1); // Assuming role 1 for admin or general access

    try {
        const [rows]: any = await connection.execute(
            "SELECT * FROM users WHERE Email = ?",
            [email]
        );

        if (rows.length === 0) {
            return null;
        }

        const user = rows[0];
        return user;
    } catch (error) {
        throw new Error("Database error");
    } finally {
        connection.end();
    }
};

export const getUserById = async (id: string) => {
    const connection = await createConnection(1); // Assuming role 1 for admin or general access

    try {
        const [rows]: any = await connection.execute(
            "SELECT * FROM users WHERE Userid = ?",
            [id]
        );

        if (rows.length === 0) {
            return null;
        }

        const user = rows[0];
        return user;
    } catch (error) {
        throw new Error("Database error");
    } finally {
        connection.end();
    }
};