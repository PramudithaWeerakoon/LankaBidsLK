'use server';
import getPrismaClientForRole from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { writeGeneralLog } from '@/utils/logging'; // Import the logging utility

export async function getDashboardDataForCustomer() {
    const prisma = getPrismaClientForRole(2);  // Adjust the role as necessary
    const user = await getCurrentUser();  // Fetching the current user from auth

    if (!user || !user.id) {
        writeGeneralLog('general.log', 'Read', 'Dashboard Data', 'Unknown', 'Fetch', 'Failure', 'User not authenticated');
        return null;
    }

    const userId = user.id;  // Extract the user ID

    try {
        // Fetching detailed item and bid data
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
                biditems.BidItemID,
                biditems.ItemName,
                biditems.ItemDescription,
                biditems.category,
                biditems.CurrentPrice,
                biditems.BidEndTime,
                biditems.Status,
                COALESCE(COUNT(bids.BidID), 0) AS BidCount  -- Using COALESCE to ensure a 0 count if no bids
            FROM 
                biditems
            LEFT JOIN 
                bids ON biditems.BidItemID = bids.BidItemID
            WHERE 
                biditems.UserID = ${userId}  -- Ensure the current user's ID is used
            GROUP BY 
                biditems.BidItemID, biditems.ItemName, biditems.ItemDescription, biditems.category, biditems.CurrentPrice, biditems.BidEndTime, biditems.Status
        `;

        // Fetching summary data
        const totalBids = await prisma.$queryRaw<{ COUNT: number }[]>`
            SELECT COUNT(BidID) AS COUNT
            FROM bids 
            WHERE UserID = ${userId};
        `;

        const pendingBids = await prisma.$queryRaw<{ COUNT: number }[]>`
            SELECT COUNT(BidID) AS COUNT
            FROM bids 
            WHERE Status = 'Pending' AND UserID = ${userId};
        `;

        const soldItems = await prisma.$queryRaw<{ COUNT: number }[]>`
            SELECT COUNT(*) AS COUNT  -- Count of completed payments
            FROM payments 
            WHERE PaymentStatus = 'Completed' AND UserID = ${userId};
        `;

        const totalProfit = await prisma.$queryRaw<{ totalProfit: number }[]>`
            SELECT COALESCE(SUM(Amount), 0) AS totalProfit
            FROM payments
            WHERE PaymentStatus = 'Completed' AND UserID = ${userId};
        `;

        writeGeneralLog('general.log', 'Read', 'Dashboard Data', user.email!, 'Fetch', 'Success', 'Dashboard data fetched successfully');
        
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
                totalBids: totalBids[0] ? Number(totalBids[0].COUNT) : 0,
                pendingBids: pendingBids[0] ? Number(pendingBids[0].COUNT) : 0,
                soldItems: soldItems[0] ? Number(soldItems[0].COUNT) : 0,
                totalProfit: totalProfit[0] ? Number(totalProfit[0].totalProfit) : 0,
            },
        };

    } catch (error: any) {
        writeGeneralLog('general.log', 'Read', 'Dashboard Data', user.email!, 'Fetch', 'Failure', error.message || 'Error fetching dashboard data');
        console.error('Error fetching dashboard data:', error.message || error);
        throw new Error('Failed to fetch dashboard data. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}
