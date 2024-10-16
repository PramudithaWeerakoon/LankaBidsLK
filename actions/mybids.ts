// actions/mybids.ts
'use server';
import getPrismaClientForRole from '@/lib/db';
import { mybids } from "@/data/mybids";

export async function getBidDetailsForCustomer() {
    const prisma = getPrismaClientForRole(3);

    const userId = await mybids();
    if (!userId) {
        console.warn('User not authenticated');
        return null;
    }

    try {
        const result = await prisma.$queryRaw<Array<{
            BidID: number;
            BidItemID: number;
            UserID: number;
            ItemName: string;
            ItemDescription: string;
            Image: Buffer | null;
            category: string;
            CurrentPrice: number;
            BidEndTime: string;
            BidAmount: number;
            BidTime: string;
            Status: string;
        }>>`
            SELECT 
                bids.BidID,
                bids.BidItemID,
                bids.UserID,
                biditems.ItemName,
                biditems.ItemDescription,
                biditems.Image,
                biditems.category,
                biditems.CurrentPrice,
                biditems.BidEndTime,
                bids.BidAmount,
                bids.BidTime,
                bids.Status
            FROM 
                bids
            JOIN 
                biditems ON bids.BidItemID = biditems.BidItemID
            WHERE 
                bids.UserID = ${userId};`;

        const processedBids = result.map((bid) => ({
            BidID: bid.BidID,
            BidItemID: bid.BidItemID,
            UserID: bid.UserID,
            ItemName: bid.ItemName,
            ItemDescription: bid.ItemDescription,
            Image: bid.Image ? Buffer.from(bid.Image).toString('base64') : null,
            category: bid.category,
            CurrentPrice: bid.CurrentPrice,
            BidEndTime: bid.BidEndTime,
            BidAmount: bid.BidAmount,
            BidTime: bid.BidTime,
            Status: bid.Status,
        }));

        console.log('Processed bids:', processedBids);
        return processedBids;
    } catch (error: any) {
        console.error('Error fetching bid details:', error.message || error);
        throw new Error('Failed to fetch bid details. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteBid(bidID: number) {
    const prisma = getPrismaClientForRole(3);

    try {
        await prisma.$executeRaw`
            DELETE FROM bids
            WHERE BidID = ${bidID};
        `;
        console.log(`Bid with ID ${bidID} has been deleted successfully.`);
    } catch (error: any) {
        console.error('Error deleting bid:', error.message || error);
        throw new Error('Failed to delete bid. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}

