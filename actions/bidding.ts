// actions/bidding.ts

"use server";
import getPrismaClientForRole from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { bidSchema } from '@/schemas';

// Fetch bid item details by BidItemID
async function fetchBidItem(BidItemID: number) {
    const prisma = getPrismaClientForRole(3); // Customer role ID
    try {
        const bidItem = await prisma.biditems.findUnique({
            where: { BidItemID },
            select: {
                BidItemID: true,
                ItemName: true,
                ItemDescription: true,
                category: true,
                Image: true,
                CurrentPrice: true,
                MinIncrement: true,
                BidEndTime: true,
            },
        });
        return bidItem;
    } catch (error) {
        console.error("Error in fetchBidItem:", error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

// Count the number of bids placed by the current user on a specific item
async function countUserBidsOnItem(BidItemID: number) {
    const user = await getCurrentUser();
    if (!user) {
        return { error: "User not authenticated" };
    }

    const prisma = getPrismaClientForRole(3);
    try {
        const userBidCount = await prisma.bids.count({
            where: { BidItemID, UserID: Number(user.id) },
        });
        return userBidCount;
    } catch (error) {
        console.error("Error in countUserBidsOnItem:", error);
        return 0;
    } finally {
        await prisma.$disconnect();
    }
}

// Count unique users who have placed bids on the specific BidItemID using groupBy

export async function countUniqueBidders(BidItemID: number) {
    const prisma = getPrismaClientForRole(3); // Customer role ID
    try {
        const uniqueBidders = await prisma.bids.groupBy({
            by: ['UserID'],
            where: { BidItemID },       // Filter by specific BidItemID
        });

        const uniqueBiddersCount = uniqueBidders.length;

        console.log(`Unique bidders for BidItemID ${BidItemID}:`, uniqueBiddersCount);

        return uniqueBiddersCount;      // Return the unique count
    } catch (error) {
        console.error("Error in countUniqueBidders:", error);
        return 0;
    } finally {
        await prisma.$disconnect();
    }
}
// Main function to get bid item details and unique user bid count
// Main function to get bid item details and unique bidder count
// Main function to get bid item details and unique bidder count
export async function getSingleBidItem(bidItemId: number) {
    const prisma = getPrismaClientForRole(3); // Customer role ID
    try {
        const bidItem = await prisma.biditems.findUnique({
            where: { BidItemID: bidItemId },
            select: {
                BidItemID: true,
                ItemName: true,
                ItemDescription: true,
                category: true,
                Image: true,
                CurrentPrice: true,
                MinIncrement: true,
                BidEndTime: true,
            },
        });

        if (!bidItem) return null;

        // Fetch unique bidder count from bids table
        const uniqueBiddersCount = await countUniqueBidders(bidItemId);

        return {
            BidItemID: bidItem.BidItemID,
            ItemName: bidItem.ItemName,
            ItemDescription: bidItem.ItemDescription,
            category: bidItem.category,
            Image: bidItem.Image ? Buffer.from(bidItem.Image).toString('base64') : '',
            CurrentPrice: bidItem.CurrentPrice ? Number(bidItem.CurrentPrice) : 0,
            MinIncrement: bidItem.MinIncrement ? Number(bidItem.MinIncrement) : 0,
            BidEndTime: bidItem.BidEndTime?.toISOString() || '',
            UniqueBiddersCount: uniqueBiddersCount, // Add unique bidder count here
        };
    } catch (error) {
        console.error("Error fetching bid item:", error);
        throw new Error("Failed to fetch bid item.");
    } finally {
        await prisma.$disconnect();
    }
}



// Get bid history for the current user on a specific bid item
export async function getUserBidHistory(BidItemID: number) {
    const user = await getCurrentUser();
    if (!user) {
        return { error: "User not authenticated" };
    }

    const prisma = getPrismaClientForRole(3);
    try {
        const bidHistory = await prisma.bids.findMany({
            where: { BidItemID, UserID: Number(user.id) },
            orderBy: { BidTime: 'desc' },
            select: {
                BidAmount: true,
                BidTime: true,
            },
        });

        // Format bid history data for the client
        return bidHistory.map(bid => ({
            BidAmount: parseFloat(bid.BidAmount.toString()),
            createdAt: bid.BidTime ? bid.BidTime.toISOString() : '',
        }));
    } catch (error) {
        console.error("Error fetching user bid history:", error);
        throw new Error("Failed to fetch bid history.");
    } finally {
        await prisma.$disconnect();
    }
}

// Place a bid for the current user on the specific BidItemID
export async function placeBid(BidItemID: number, BidAmount: number) {
    const user = await getCurrentUser();
    if (!user) {
        return { success: false, message: "User not authenticated" };
    }

    const prisma = getPrismaClientForRole(3);
    try {
        const validatedFields = bidSchema.safeParse({ BidItemID, BidAmount, MinIncrement: 1.0 });
        if (!validatedFields.success) {
            const errorMessage = validatedFields.error.errors.map(err => err.message).join(", ");
            return { success: false, message: errorMessage };
        }

        const userId = Number(user.id);
        if (isNaN(userId) || userId <= 0) {
            return { success: false, message: "Invalid User ID" };
        }

        // Perform the bid insertion and current price update as a transaction
        const transactionResult = await prisma.$transaction(async (tx) => {
            await tx.bids.create({
                data: {
                    BidItemID,
                    UserID: userId,
                    BidAmount,
                },
            });

            return await tx.biditems.update({
                where: { BidItemID },
                data: { CurrentPrice: BidAmount },
            });
        });

        return { success: true, message: 'Bid placed and current price updated successfully' };
        
    } catch (error) {
        console.error("Error placing bid:", error);
        return { success: false, message: 'Failed to place bid', error };
    } finally {
        await prisma.$disconnect();
    }
}

// Fetch additional bid items for the carousel
export async function getAdditionalBidItems(currentBidItemId: number) {
    const prisma = getPrismaClientForRole(3);
    try {
        const additionalBidItems = await prisma.biditems.findMany({
            where: {
                NOT: { BidItemID: currentBidItemId },
            },
            select: {
                BidItemID: true,
                ItemName: true,
                CurrentPrice: true,
                Image: true,
            },
            take: 5, // Limit to 5 items for the carousel
        });

        // Convert images to base64 and CurrentPrice to number
        return additionalBidItems.map(item => ({
            BidItemID: item.BidItemID,
            ItemName: item.ItemName,
            CurrentPrice: item.CurrentPrice ? Number(item.CurrentPrice) : null,
            Image: item.Image ? Buffer.from(item.Image).toString('base64') : '',
        }));
    } catch (error) {
        console.error("Error fetching additional bid items:", error);
        return [];
    } finally {
        await prisma.$disconnect();
    }
}

// Count unique users who have placed bids on a specific BidItemID
