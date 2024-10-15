import getPrismaClientForRole from '@/lib/db';

export async function fetchUserBids(userID: number) {
    const prisma = getPrismaClientForRole(3); // Customer Role ID
    try {
        // Fetch bids for the user
        const bids = await prisma.bids.findMany({
            where: { UserID: userID },
            select: {
                BidID: true,
                BidAmount: true,
                BidItemID: true,
            },
        });

        // Extract BidItemIDs and fetch related biditems
        const bidItemIDs = bids.map(bid => bid.BidItemID);
        const validBidItemIDs = bidItemIDs.filter((id): id is number => id !== null);
        const bidItems = await prisma.biditems.findMany({
            where: { BidItemID: { in: validBidItemIDs } },
            select: {
                BidItemID: true,
                ItemName: true,
                StartingPrice: true,
                CurrentPrice: true,
            },
        });

        // Map biditems by BidItemID for easier lookup
        const bidItemsMap: Record<number, { ItemName: string; StartingPrice: number; CurrentPrice: number }> = {};
        bidItems.forEach(item => {
            if (item.BidItemID) {
                bidItemsMap[item.BidItemID] = {
                    ItemName: item.ItemName,
                    StartingPrice: item.StartingPrice.toNumber(),
                    CurrentPrice: item.CurrentPrice ? item.CurrentPrice.toNumber() : 0,
                };
            }
        });

        // Combine bids with corresponding bid item details
        return bids.map(bid => {
            const itemDetails = bid.BidItemID ? bidItemsMap[bid.BidItemID] : {
                ItemName: 'Unknown Item',
                StartingPrice: 0,
                CurrentPrice: 0,
            };

            return {
                BidID: bid.BidID,
                ItemName: itemDetails.ItemName,
                StartingPrice: itemDetails.StartingPrice,
                CurrentPrice: itemDetails.CurrentPrice,
                BidAmount: bid.BidAmount ? Number(bid.BidAmount) : 0,
            };
        });
    } catch (error) {
        console.error('Error fetching user bids:', error);
        throw new Error('Failed to fetch user bids');
    } finally {
        await prisma.$disconnect();
    }
}
