import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/db';
import { getUserByEmail } from '../../../lib/user'; // Assuming this is the correct path

async function loginUser(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await getUserByEmail(email, password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const roleId = user.role_id;

        try {
            const db = await connectToDatabase(roleId);

            res.status(200).json({ message: `Logged in as ${getRoleName(roleId)}`, role: getRoleName(roleId) });
        } catch (error) {
            console.error('Error connecting to the database', error);
            res.status(500).json({ message: 'Database connection error' });
        }
    } catch (error) {
        console.error('Error fetching user', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

function getRoleName(roleId: number) {
    switch (roleId) {
        case 1: return 'Admin';
        case 4: return 'Auditor';
        case 3: return 'Customer';
        case 2: return 'Seller';
        default: return 'Unknown';
    }
}

export default loginUser;