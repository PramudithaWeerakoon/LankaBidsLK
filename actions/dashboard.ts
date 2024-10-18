'use server';
import getPrismaClientForRole from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getDashboardDataForCustomer() {
    const prisma = getPrismaClientForRole(2);  // Adjust the role as necessary
    const user = await getCurrentUser();  // Fetching the current user from auth

    if (!user || !user.id) {
        console.warn('User not authenticated');
        return null;
    }

    const userId = user.id;  // Extract the user ID
    

    try {
        // Fetching detailed item and bid data
        // Fetch items for the current user along with bid count
const items = await prisma.$queryRaw<Array<{
    BidItemID: number;
    ItemName: string;
    ItemDescription: string;
    category: string;
    CurrentPrice: number;
    BidEndTime: string;
    Status: string;
    BidCount: number;
}>>`
    SELECT 
        bi.BidItemID,
        bi.ItemName,
        bi.ItemDescription,
        bi.category,
        bi.CurrentPrice,
        bi.BidEndTime,
        bi.Status,
        COALESCE(COUNT(b.BidID), 0) AS BidCount  -- Using COALESCE to ensure a 0 count if no bids
    FROM 
        biditems bi
    LEFT JOIN 
        bids b ON bi.BidItemID = b.BidItemID
    WHERE 
        bi.UserID = ${userId}  -- Ensure the current user's ID is used
    GROUP BY 
        bi.BidItemID, bi.ItemName, bi.ItemDescription, bi.category, bi.CurrentPrice, bi.BidEndTime, bi.Status  -- Ensure GROUP BY includes all necessary fields
`;


        // Fetching summary data
        // Fetch total bids for the user's bid items
        const totalBids = await prisma.$queryRaw<{ COUNT: number }[]>`
            SELECT COUNT(b.BidID) AS COUNT  -- Count of total bids
            FROM bids b
            JOIN biditems bi ON b.BidItemID = bi.BidItemID  -- Join with biditems to filter by user
            WHERE bi.UserID = ${userId};  -- Ensure only bids for the current user's bid items
        `;


        // Fetch count of pending bids for the user's bid items
        const pendingBids = await prisma.$queryRaw<{ COUNT: number }[]>`
            SELECT COUNT(b.BidID) AS COUNT  -- Count of pending bids
        FROM bids b
        JOIN biditems bi ON b.BidItemID = bi.BidItemID  -- Join with biditems to filter by user
        WHERE b.Status = 'Pending' 
        AND bi.UserID = ${userId};  -- Ensure only pending bids for the current user's bid items
        `;



        // Fetch the count of sold items where PaymentStatus is 'Completed' by joining the payments table
        // Fetch count of sold items based on completed payments and bid item status
     const soldItems = await prisma.$queryRaw<{ COUNT: number }[]>`
        SELECT COUNT(*) AS COUNT  -- Count of sold items
        FROM payments p
        JOIN biditems b ON p.BidItemID = b.BidItemID
        WHERE p.PaymentStatus = 'Completed' 
        AND b.UserID = ${userId} 
        AND b.Status = 'Completed';  -- Ensure only sold items for the current user
        `;


        // Fetch total profit from payments table
        // Fetch total profit from payments table based on user's bid items
        const totalProfit = await prisma.$queryRaw<{ totalProfit: number }[]>`
            SELECT COALESCE(SUM(p.Amount), 0) AS totalProfit
            FROM payments p
            JOIN biditems b ON p.BidItemID = b.BidItemID
            WHERE p.PaymentStatus = 'Completed' AND b.UserID = ${userId};
        `;

        console.log('Pending Bids:', pendingBids);  // Add this to check the query result
        console.log('soldItems:', soldItems);

       return {
    items: items.map((item) => ({
        BidItemID: item.BidItemID,
        ItemName: item.ItemName,
        ItemDescription: item.ItemDescription,
        category: item.category,
        CurrentPrice: item.CurrentPrice,
        BidEndTime: item.BidEndTime,
        Status: item.Status,
        BidCount: item.BidCount,
    })),
    summary: {
        totalBids: totalBids[0] ? Number(totalBids[0].COUNT) : 0,  // Convert BigInt to number
        pendingBids: pendingBids[0] ? Number(pendingBids[0].COUNT) : 0,  // Convert BigInt to number
        soldItems: soldItems[0] ? Number(soldItems[0].COUNT) : 0,  // Convert BigInt to number
        totalProfit: totalProfit[0] ? Number(totalProfit[0].totalProfit) : 0,  // Convert BigInt to number
    },
};

    } catch (error: any) {
        console.error('Error fetching dashboard data:', error.message || error);
        throw new Error('Failed to fetch dashboard data. Please try again later.');
    } finally {
        
        await prisma.$disconnect();
    }
}
