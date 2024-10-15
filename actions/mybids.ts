import { mybids } from "@/data/mybids";
import getPrismaClientForRole from '@/lib/db';

export async function getBidDetailsForCustomer() {
    const userId = await mybids(); // Get the UserID from the session

    if (!userId) {
        console.warn('User not authenticated');
        return null;
    }

    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);

    try {
        const result = await prisma.$queryRaw<
            Array<{
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
            }>
        >`
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
                bids.UserID = ${userId};`; // Filter by UserID

        if (!result || result.length === 0) {
            console.warn(`No bids found for user ID: ${userId}`);
            return [];
        }

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
        console.log('Processed bids lk:', processedBids);

        return processedBids;
    } catch (error: any) {
        console.error('Error fetching bid details:', error.message || error);
        throw new Error('Failed to fetch bid details. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteBid(bidID: number) {
    const userId = await mybids(); // Get the UserID from the session
    console.log('User ID:', userId); // Debugging line

    if (!userId) {
        console.warn('User not authenticated');
        return null;
    }

    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);

    try {
        const result = await prisma.$executeRaw`
            DELETE FROM bids 
            WHERE BidID = ${bidID} AND UserID = ${userId};`;
        console.log('Delete result:', result); // Debugging line

        return { success: true, message: 'Bid deleted successfully.' };
    } catch (error: any) {
        console.error('Error deleting bid:', error.message || error);
        throw new Error('Failed to delete bid. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}
