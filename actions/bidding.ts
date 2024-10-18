// actions/bidding.ts

"use server";
import getPrismaClientForRole from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { bidSchema } from '@/schemas';
import { ALL } from 'dns';
import { writeGeneralLog } from '@/utils/logging';


// Fetch bid item details by BidItemID
/*async function fetchBidItem(BidItemID: number) {
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
}*/

// Count the number of bids placed by the current user on a specific item
/*async function countUserBidsOnItem(BidItemID: number) {
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
}*/

// Place a bid for the current user on the specific BidItemID
/*export async function placeBid(BidItemID: number, BidAmount: number) {
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
}*/

// Count unique users who have placed bids on the specific BidItemID using groupBy
// Count unique users who have placed bids on the specific BidItemID using groupBy
export async function countUniqueBidders(BidItemID: number) {
    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);
    const user = await getCurrentUser();

    try {
        const result = await prisma.$queryRaw<Array<{ UserID: number }>>`
            SELECT DISTINCT UserID 
            FROM bids 
            WHERE BidItemID = ${BidItemID};
        `;
        return result.length; // Count of unique users
    } catch (error: any) {
        writeGeneralLog('general.log', 'Fetch', 'Bid Item', user?.email || 'Unknown', 'CountUniqueBidders', 'Failure', `Error: ${error.message || error}`);
        console.error('Error in countUniqueBidders:', error.message || error);
        return 0;
    } finally {
        await prisma.$disconnect();
    }
}

// Fetch bid item details
export async function getSingleBidItem(bidItemId: number) {
    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);
    const user = await getCurrentUser();

    if (!user) {
        writeGeneralLog('general.log', 'Fetch', 'Bid Item', 'Guest', 'getSingleBidItem', 'Failure', 'User not authenticated');
        return null;
    }

    try {
        const result = await prisma.$queryRaw<Array<{
            BidItemID: number;
            ItemName: string;
            ItemDescription: string;
            category: string;
            Image: Buffer | null;
            CurrentPrice: number;
            MinIncrement: number;
            BidEndTime: string;
        }>>`
            SELECT BidItemID, ItemName, ItemDescription, category, Image, CurrentPrice, MinIncrement, BidEndTime
            FROM biditems WHERE BidItemID = ${bidItemId};
        `;

        if (!result || result.length === 0) {
            writeGeneralLog('general.log', 'Fetch', 'Bid Item', user.email!, 'getSingleBidItem', 'Failure', `No bid item found with ID: ${bidItemId}`);
            return null;
        }

        const bidItem = result[0];
        const uniqueBiddersCount = await countUniqueBidders(bidItemId);

        writeGeneralLog('general.log', 'Fetch', 'Bid Item', user.email!, 'getSingleBidItem', 'Success', 'Bid item fetched successfully');
        return {
            ...bidItem,
            UniqueBiddersCount: uniqueBiddersCount,
            Image: bidItem.Image ? Buffer.from(bidItem.Image).toString('base64') : '',
        };
    } catch (error: any) {
        writeGeneralLog('general.log', 'Fetch', 'Bid Item', user.email!, 'getSingleBidItem', 'Failure', `Error: ${error.message || error}`);
        console.error('Error fetching bid item:', error.message || error);
        throw new Error('Failed to fetch bid item.');
    } finally {
        await prisma.$disconnect();
    }
}

// Fetch bid history for the current user on a specific bid item
export async function getUserBidHistory(BidItemID: number) {
    const user = await getCurrentUser();
    if (!user) {
        writeGeneralLog('general.log', 'Fetch', 'Bid History', 'Guest', 'getUserBidHistory', 'Failure', 'User not authenticated');
        return { error: "User not authenticated" };
    }

    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);

    try {
        const result = await prisma.$queryRaw<Array<{ BidAmount: number, BidTime: Date }>>`
            SELECT BidAmount, BidTime
            FROM bids WHERE BidItemID = ${BidItemID} AND UserID = ${Number(user.id)}
            ORDER BY BidTime DESC;
        `;

        writeGeneralLog('general.log', 'Fetch', 'Bid History', user.email!, 'getUserBidHistory', 'Success', 'Bid history fetched successfully');
        return result.map(bid => ({
            BidAmount: parseFloat(bid.BidAmount.toString()),
            createdAt: bid.BidTime ? new Date(bid.BidTime).toISOString() : '',
        }));
    } catch (error: any) {
        writeGeneralLog('general.log', 'Fetch', 'Bid History', user.email!, 'getUserBidHistory', 'Failure', `Error: ${error.message || error}`);
        console.error('Error fetching user bid history:', error.message || error);
        throw new Error('Failed to fetch bid history.');
    } finally {
        await prisma.$disconnect();
    }
}

// Fetch additional bid items for the carousel
export async function getAdditionalBidItems(currentBidItemId: number) {
    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);
    const user = await getCurrentUser();

    try {
        const result = await prisma.$queryRaw<Array<{
            BidItemID: number;
            ItemName: string;
            CurrentPrice: number | null;
            Image: Buffer | null;
        }>>`
            SELECT BidItemID, ItemName, CurrentPrice, Image
            FROM biditems WHERE BidItemID != ${currentBidItemId} LIMIT 8;
        `;

        if (!result || result.length === 0) {
            writeGeneralLog('general.log', 'Fetch', 'Additional Bid Items', user?.email || 'Unknown', 'getAdditionalBidItems', 'Failure', 'No additional bid items found');
            return [];
        }

        writeGeneralLog('general.log', 'Fetch', 'Additional Bid Items', user?.email || 'Unknown', 'getAdditionalBidItems', 'Success', 'Additional bid items fetched successfully');
        return result.map(item => ({
            BidItemID: item.BidItemID,
            ItemName: item.ItemName,
            CurrentPrice: item.CurrentPrice ? Number(item.CurrentPrice) : null,
            Image: item.Image ? Buffer.from(item.Image).toString('base64') : '',
        }));
    } catch (error: any) {
        writeGeneralLog('general.log', 'Fetch', 'Additional Bid Items', user?.email || 'Unknown', 'getAdditionalBidItems', 'Failure', `Error: ${error.message || error}`);
        console.error("Error fetching additional bid items:", error.message || error);
        return [];
    } finally {
        await prisma.$disconnect();
    }
}

// Submit payment details and place a bid
export async function submitNewPaymentAndPlaceBid(
    BidItemID: number,
    BidAmount: number,
    CardHolderName: string,
    CardNo: string,
    cvv: string,
    BillingAddress: string
) {
    const user = await getCurrentUser();
    if (!user) {
        writeGeneralLog('general.log', 'Submit', 'Payment', 'Guest', 'submitNewPaymentAndPlaceBid', 'Failure', 'User not authenticated');
        return { success: false, message: "User not authenticated" };
    }

    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);

    try {
        const userId = Number(user.id);
        const paymentDate = new Date();
        const paymentMethod = 'Credit Card';
        const paymentStatus = 'Pending';

        // Insert new payment entry using raw SQL
        await prisma.$executeRaw`
            INSERT INTO payments (UserID, BidItemID, CardHolderName, CardNo, cvv, Amount, BillingAddress, PaymentDate, PaymentStatus, PaymentMethod)
            VALUES (${userId}, ${BidItemID}, ${CardHolderName}, ${CardNo}, ${cvv}, ${BidAmount}, ${BillingAddress}, ${paymentDate}, ${paymentStatus}, ${paymentMethod});
        `;
        writeGeneralLog('general.log', 'Create', 'Payment', user.email!, 'submitNewPaymentAndPlaceBid', 'Success', 'Payment processed successfully');

        // Perform bid insertion and current price update as a transaction
        await prisma.$transaction(async (tx) => {
            // Insert new bid entry using raw SQL
            await tx.$executeRaw`
                INSERT INTO bids (BidItemID, UserID, BidAmount)
                VALUES (${BidItemID}, ${userId}, ${BidAmount});
            `;
            writeGeneralLog('general.log', 'Create', 'Bid', user.email!, 'submitNewPaymentAndPlaceBid', 'Success', 'Bid placed successfully');

            // Update the current bid price on bid item using raw SQL
            await tx.$executeRaw`
                UPDATE biditems
                SET CurrentPrice = ${BidAmount}
                WHERE BidItemID = ${BidItemID};
            `;
            writeGeneralLog('general.log', 'Update', 'Bid Item', user.email!, 'submitNewPaymentAndPlaceBid', 'Success', 'Bid price updated successfully');
        });

        return { success: true, message: 'Payment and bid processed successfully' };

    } catch (error: any) {
        writeGeneralLog('general.log', 'Submit', 'Payment', user.email!, 'submitNewPaymentAndPlaceBid', 'Failure', `Error: ${error.message || error}`);
        console.error("Error processing payment and bid:", error.message || error);
        return { success: false, message: 'Failed to process payment and bid', error };
    } finally {
        await prisma.$disconnect();
    }
}

// Update payment and place a new bid
export async function updatePaymentAndPlaceBid(BidItemID: number, BidAmount: number) {
    const user = await getCurrentUser();
    if (!user) {
        writeGeneralLog('general.log', 'Update', 'Payment', 'Guest', 'updatePaymentAndPlaceBid', 'Failure', 'User not authenticated');
        return { success: false, message: "User not authenticated" };
    }

    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);

    try {
        const userId = Number(user.id);
        const paymentDate = new Date();

        await prisma.$transaction(async (tx) => {
            // Update only Amount and PaymentDate fields in the payments table using raw SQL
            const updatedPayment = await tx.$executeRaw`
                UPDATE payments 
                SET Amount = ${BidAmount}, PaymentDate = ${paymentDate}
                WHERE UserID = ${userId} AND BidItemID = ${BidItemID};
            `;
            writeGeneralLog('general.log', 'Update', 'Payment', user.email!, 'updatePaymentAndPlaceBid', 'Success', 'Payment updated successfully');

            // Check if the update affected any rows
            if (updatedPayment === 0) {
                writeGeneralLog('general.log', 'Update', 'Payment', user.email!, 'updatePaymentAndPlaceBid', 'Failure', 'No payment record found for update');
                throw new Error('No existing payment record found for update');
            }

            // Insert a new bid entry in the bids table using raw SQL
            await tx.$executeRaw`
                INSERT INTO bids (BidItemID, UserID, BidAmount)
                VALUES (${BidItemID}, ${userId}, ${BidAmount});
            `;
            writeGeneralLog('general.log', 'Create', 'Bid', user.email!, 'updatePaymentAndPlaceBid', 'Success', 'Bid placed successfully');

            // Update the CurrentPrice field in the biditems table using raw SQL
            await tx.$executeRaw`
                UPDATE biditems
                SET CurrentPrice = ${BidAmount}
                WHERE BidItemID = ${BidItemID};
            `;
            writeGeneralLog('general.log', 'Update', 'Bid Item', user.email!, 'updatePaymentAndPlaceBid', 'Success', 'Bid price updated successfully');
        });

        return { success: true, message: 'Payment, bid, and bid item updated successfully' };

    } catch (error: any) {
        writeGeneralLog('general.log', 'Update', 'Payment', user.email!, 'updatePaymentAndPlaceBid', 'Failure', `Error: ${error.message || error}`);
        console.error("Error updating payment and placing bid:", error.message || error);
        return { success: false, message: 'Failed to update payment and place bid', error };
    } finally {
        await prisma.$disconnect();
    }
}

// Check existing payment and bid
export async function checkExistingPaymentAndBid(BidItemID: number) {
    const user = await getCurrentUser();
    if (!user) {
        writeGeneralLog('general.log', 'Fetch', 'Payment', 'Guest', 'checkExistingPaymentAndBid', 'Failure', 'User not authenticated');
        return { error: "User not authenticated" };
    }

    const UserID = Number(user.id);
    const roleId = 3; // Adjust role if necessary
    const prisma = getPrismaClientForRole(roleId);

    try {
        // Check for an existing payment for this user and bid item using raw SQL
        const existingPayment = await prisma.$queryRaw<Array<{ PaymentID: number, PaymentDate: Date }>>`
            SELECT PaymentID, PaymentDate
            FROM payments
            WHERE UserID = ${UserID} AND BidItemID = ${BidItemID} LIMIT 1;
        `;

        if (existingPayment.length > 0) {
            writeGeneralLog('general.log', 'Fetch', 'Payment', user.email!, 'checkExistingPaymentAndBid', 'Success', 'Existing payment found');
            return {
                exists: true,
                paymentData: {
                    PaymentID: existingPayment[0].PaymentID,
                    paymentDate: existingPayment[0].PaymentDate,
                },
            };
        }

        writeGeneralLog('general.log', 'Fetch', 'Payment', user.email!, 'checkExistingPaymentAndBid', 'Success', 'No existing payment found');
        return { exists: false };
    } catch (error: any) {
        writeGeneralLog('general.log', 'Fetch', 'Payment', user.email!, 'checkExistingPaymentAndBid', 'Failure', `Error: ${error.message || error}`);
        console.error("Error checking existing payment:", error.message || error);
        return { error: "Error checking payment status" };
    } finally {
        await prisma.$disconnect();
    }
}