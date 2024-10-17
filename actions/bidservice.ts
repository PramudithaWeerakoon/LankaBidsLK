import getPrismaClientForRole from "@/lib/db";

const prisma = getPrismaClientForRole(1);

export async function closeExpiredBids() {
  // Step 1: Identify expired bid items
  const expiredBids = await prisma.biditems.findMany({
    where: {
      BidEndTime: {
        lt: new Date(),
      },
      Status: 'Open',
    },
  });

  // Step 2: Process each expired bid item
  for (const bidItem of expiredBids) {
    // Find the highest bid for this bid item
    const highestBid = await prisma.bids.findFirst({
      where: {
        BidItemID: bidItem.BidItemID,
        Status: 'Pending',
      },
      orderBy: {
        BidAmount: 'desc',
      },
    });

    if (highestBid) {
      // Mark the highest bid as "Accepted"
      await prisma.bids.update({
        where: {
          BidID: highestBid.BidID,
        },
        data: {
          Status: 'Accepted',
        },
      });

      // Mark all other bids as "Rejected"
      await prisma.bids.updateMany({
        where: {
          BidItemID: bidItem.BidItemID,
          Status: 'Pending',
          BidID: { not: highestBid.BidID },
        },
        data: {
          Status: 'Rejected',
        },
      });
    }

    // Update the bid item status to "Closed"
    await prisma.biditems.update({
      where: {
        BidItemID: bidItem.BidItemID,
      },
      data: {
        Status: 'Closed',
      },
    });
  }
}
