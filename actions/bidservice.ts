import getPrismaClientForRole from "@/lib/db";
import { writeGeneralLog } from "@/utils/logging"; // Import the logging utility

const prisma = getPrismaClientForRole(1);

export async function closeExpiredBids() {
  const operation = "Update";
  const resource = "Bids";

  try {
    // Step 1: Identify expired bid items
    const expiredBids = await prisma.biditems.findMany({
      where: {
        BidEndTime: {
          lt: new Date(),
        },
        Status: 'Open',
      },
    });

    if (expiredBids.length === 0) {
      writeGeneralLog('general.log', operation, resource, 'System', 'Close Expired Bids', 'Info', 'No expired bids found');
      return;
    }

    // Step 2: Process each expired bid item
    for (const bidItem of expiredBids) {
      const bidItemId = bidItem.BidItemID;

      try {
        // Find the highest bid for this bid item
        const highestBid = await prisma.bids.findFirst({
          where: {
            BidItemID: bidItemId,
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
          writeGeneralLog('general.log', operation, resource, 'System', `Accept Bid for BidItemID ${bidItemId}`, 'Success', `Accepted highest bid with BidID: ${highestBid.BidID}`);

          // Mark all other bids as "Rejected"
          await prisma.bids.updateMany({
            where: {
              BidItemID: bidItemId,
              Status: 'Pending',
              BidID: { not: highestBid.BidID },
            },
            data: {
              Status: 'Rejected',
            },
          });
          writeGeneralLog('general.log', operation, resource, 'System', `Reject Bids for BidItemID ${bidItemId}`, 'Success', `Rejected other bids for BidItemID: ${bidItemId}`);
        }

        // Update the bid item status to "Closed"
        await prisma.biditems.update({
          where: {
            BidItemID: bidItemId,
          },
          data: {
            Status: 'Closed',
          },
        });
        writeGeneralLog('general.log', operation, resource, 'System', `Close BidItem ${bidItemId}`, 'Success', `Bid item closed successfully`);
      } catch (error) {
        writeGeneralLog('general.log', operation, resource, 'System', `Close BidItem ${bidItemId}`, 'Failure', `Error: ${(error as any).message}`);
        console.error(`Error processing bid item ${bidItemId}:`, error);
      }
    }
  } catch (error) {
    writeGeneralLog('general.log', operation, resource, 'System', 'Close Expired Bids', 'Failure', `Error: ${(error as any).message}`);
    console.error("Error closing expired bids:", error);
  } finally {
    await prisma.$disconnect();
  }
}
