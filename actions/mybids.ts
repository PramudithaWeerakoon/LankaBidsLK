// actions/mybids.ts
'use server';
import getPrismaClientForRole from '@/lib/db';
import { mybids } from "@/data/mybids";
import { writeGeneralLog } from '@/utils/logging';
import { getCurrentUser } from '@/lib/auth';

export async function getBidDetailsForCustomer() {
    const prisma = getPrismaClientForRole(3);
    const user = await getCurrentUser();

    const userId = await mybids();
    if (!userId) {
        writeGeneralLog('general.log', 'Fetch', 'My Bids', 'Guest', 'Fetch Bids', 'Failed', 'User not authenticated');
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

        if (user) {
            writeGeneralLog('general.log', 'Fetch', 'My Bids', user.email!, 'Fetch Bids', 'Success', 'Fetched My Bids successfully');
        } else {
            writeGeneralLog('general.log', 'Fetch', 'My Bids', 'Unknown', 'Fetch Bids', 'Success', 'Fetched My Bids successfully');
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

        console.log('Processed bids:', processedBids);
        return processedBids;
    } catch (error: any) {
        if (user) {
            writeGeneralLog('general.log', 'Fetch', 'My Bids', user.email!, 'Fetch Bids', 'Failed', `Error: ${error.message || error}`);
        } else {
            writeGeneralLog('general.log', 'Fetch', 'My Bids', 'Unknown', 'Fetch Bids', 'Failed', `Error: ${error.message || error}`);
        }
        console.error('Error fetching bid details:', error.message || error);
        throw new Error('Failed to fetch bid details. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}

export async function deleteBid(bidID: number) {
    const prisma = getPrismaClientForRole(3);
    const user = await getCurrentUser();

    if (!user) {
        writeGeneralLog('general.log', 'Delete', 'My Bids', 'Guest', 'Delete Bid', 'Failed', 'User not authenticated');
        throw new Error('User not authenticated');
    }

    try {
        await prisma.$executeRaw`
            DELETE FROM bids
            WHERE BidID = ${bidID};
        `;
        writeGeneralLog('general.log', 'Delete', 'My Bids', user.email!, `Bid ID: ${bidID}`, 'Success', 'Bid deleted successfully');
        console.log(`Bid with ID ${bidID} has been deleted successfully.`);
    } catch (error: any) {
        writeGeneralLog('general.log', 'Delete', 'My Bids', user.email!, `Bid ID: ${bidID}`, 'Failed', `Error: ${error.message || error}`);
        console.error('Error deleting bid:', error.message || error);
        throw new Error('Failed to delete bid. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}
