
"use server";
import getPrismaClientForRole from '@/lib/db';


// Fetch user bids based on UserID
export async function getUserBids(userID: number) {
    const prisma = getPrismaClientForRole(3); // Customer role ID
    try {
        const [rows] = await getPrismaClientForRole.execute(
            'SELECT BidItemID, ItemName, ItemDescription, category, Image, CurrentPrice, MinIncrement, BidEndTime FROM biditems where BidItemID = ?',
            [BidItemID]
        );

        // Ensure rows is an array and convert BLOB to Base64 string
        const productDetails = (rows as any[]).map((row: any) => ({
            BidItemID: row.BidItemID,
            ItemName: row.ItemName,
            ItemDescription: row.ItemDescription,
            category: row.category,
            Image: row.Image ? Buffer.from(row.Image).toString('base64') : null,
            CurrentPrice: row.CurrentPrice,
            MinIncrement: row.MinIncrement,
            BidEndTime: row.BidEndTime
        }));

        return productDetails as Array<{
            BidItemID: number; 
            ItemName: string; 
            ItemDescription: string;
            category: string; 
            Image: string | null; 
            CurrentPrice: number; 
            MinIncrement: number;
            BidEndTime: string;
        }>;
    } finally {
        await connection.end();
    }
}

export async function placeBid(BidItemID: number, UserID: number, BidAmount: number) {
    const connection = await getPrismaClientForRole(3); // Customer role ID
    try {
        await connection.beginTransaction();

        await connection.execute(
            'INSERT INTO bids (BidItemID, UserID, BidAmount, BidTime, Status) VALUES (?, ?, ?, NOW(), ?)',
            [BidItemID, UserID, BidAmount, 'Pending']
        );

        await connection.execute(
            'UPDATE biditems SET CurrentPrice = ? WHERE BidItemID = ?',
            [BidAmount, BidItemID]
        );

        await connection.commit();
        return { success: true, message: 'Bid placed successfully' };
    } catch (error) {
        await connection.rollback();
        return { success: false, message: 'Failed to place bid', error };
    } finally {
        await connection.end();
    }
}