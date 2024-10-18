'use server';

import getPrismaClientForRole from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function getBidsForItem(bidItemID: number) {
    const prisma = getPrismaClientForRole(2); // Assuming role 2 for the seller
    
    try {
        const bids = await prisma.$queryRaw<
            Array<{
                BidID: number;
                BidAmount: number;
                BidTime: Date;
                Status: string;
                Username: string | null;  // Username is nullable for non-accepted bids
                BillingAddress: string | null;  // Address is nullable for non-accepted bids
            }>
        >(Prisma.sql`
            SELECT 
                b.BidID, 
                b.BidAmount, 
                b.BidTime, 
                b.Status, 
                CASE WHEN b.Status = 'Accepted' THEN u.Username ELSE NULL END AS Username, 
                CASE WHEN b.Status = 'Accepted' THEN p.BillingAddress ELSE NULL END AS BillingAddress
            FROM bids b
            LEFT JOIN users u ON b.UserID = u.UserID AND b.Status = 'Accepted'
            LEFT JOIN payments p ON b.BidItemID = p.BidItemID AND b.Status = 'Accepted'
            WHERE b.BidItemID = ${bidItemID}
            ORDER BY b.BidTime DESC;
        `);

        return bids;
    } catch (error) {
        console.error('Error fetching bids:', error);
        throw new Error('Failed to fetch bids.');
    } finally {
        await prisma.$disconnect();
    }
}
