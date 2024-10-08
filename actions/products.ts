import { createConnection } from '@/lib/db';

export async function getProductsForCustomer() {
    const connection = await createConnection(3); // Customer role ID
    const [rows] = await connection.execute(
        'SELECT BidItemID, ItemName, category, Image, CurrentPrice, BidEndTime FROM biditems' // Include BidEndTime in the query
    );
    await connection.end();

    // Ensure rows is an array
    const products = (rows as any[]).map((row: any) => ({
        BidItemID: row.BidItemID,
        ItemName: row.ItemName,
        category: row.category,
        Image: row.Image ? Buffer.from(row.Image).toString('base64') : null,
        CurrentPrice: row.CurrentPrice,
        BidEndTime: row.BidEndTime
    }));

    return products as Array<{
        BidItemID: number; 
        ItemName: string; 
        category: string; 
        Image: string | null; 
        CurrentPrice: number; 
        BidEndTime: string;
    }>;
}