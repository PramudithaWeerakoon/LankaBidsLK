// actions/bidding.ts

"use server";
import getPrismaClientForRole from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { bidSchema } from '@/schemas';
import { ALL } from 'dns';

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
export async function countUniqueBidders(BidItemID: number) {
    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);

    try {
        const result = await prisma.$queryRaw<
            Array<{ UserID: number }>
        >`
            SELECT DISTINCT UserID 
            FROM bids 
            WHERE BidItemID = ${BidItemID};
        `;

        return result.length; // Count of unique users
    } catch (error: any) {
        console.error('Error in countUniqueBidders:', error.message || error);
        return 0;
    } finally {
        await prisma.$disconnect();
    }
}


// Main function to get bid item details and unique user bid count
// Main function to get bid item details and unique bidder count
// Main function to get bid item details and unique bidder count
export async function getSingleBidItem(bidItemId: number) {
    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);

    try {
        const result = await prisma.$queryRaw<
            Array<{
                BidItemID: number;
                ItemName: string;
                ItemDescription: string;
                category: string;
                Image: Buffer | null;
                CurrentPrice: number;
                MinIncrement: number;
                BidEndTime: string;
            }>
        >`
            SELECT 
                BidItemID, 
                ItemName, 
                ItemDescription, 
                category, 
                Image, 
                CurrentPrice, 
                MinIncrement, 
                BidEndTime 
            FROM 
                biditems 
            WHERE 
                BidItemID = ${bidItemId};
        `;

        if (!result || result.length === 0) return null;

        const bidItem = result[0];

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
            BidEndTime: bidItem.BidEndTime ? new Date(bidItem.BidEndTime).toISOString() : '',
            UniqueBiddersCount: uniqueBiddersCount, // Include unique bidder count
        };
    } catch (error: any) {
        console.error('Error fetching bid item:', error.message || error);
        throw new Error('Failed to fetch bid item.');
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

    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);

    try {
        const result = await prisma.$queryRaw<
            Array<{
                BidAmount: number;
                BidTime: Date;
            }>
        >`
            SELECT 
                BidAmount, 
                BidTime 
            FROM 
                bids 
            WHERE 
                BidItemID = ${BidItemID} AND UserID = ${Number(user.id)} 
            ORDER BY 
                BidTime DESC;
        `;

        // Format bid history data for the client
        return result.map(bid => ({
            BidAmount: parseFloat(bid.BidAmount.toString()),
            createdAt: bid.BidTime ? new Date(bid.BidTime).toISOString() : '',
        }));
    } catch (error: any) {
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

    try {
        const result = await prisma.$queryRaw<
            Array<{
                BidItemID: number;
                ItemName: string;
                CurrentPrice: number | null;
                Image: Buffer | null;
            }>
        >`
            SELECT 
                BidItemID, 
                ItemName, 
                CurrentPrice, 
                Image 
            FROM 
                biditems 
            WHERE 
                BidItemID != ${currentBidItemId} 
            LIMIT 8; 
        `;

        // Convert images to base64 and CurrentPrice to number
        return result.map(item => ({
            BidItemID: item.BidItemID,
            ItemName: item.ItemName,
            CurrentPrice: item.CurrentPrice ? Number(item.CurrentPrice) : null,
            Image: item.Image ? Buffer.from(item.Image).toString('base64') : '',
        }));
    } catch (error: any) {
        console.error("Error fetching additional bid items:", error.message || error);
        return [];
    } finally {
        await prisma.$disconnect();
    }
}

// Count unique users who have placed bids on a specific BidItemID
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

        // Perform bid insertion and current price update as a transaction
        await prisma.$transaction(async (tx) => {
            // Insert new bid entry using raw SQL
            await tx.$executeRaw`
                INSERT INTO bids (BidItemID, UserID, BidAmount)
                VALUES (${BidItemID}, ${userId}, ${BidAmount});
            `;

            // Update the current bid price on bid item using raw SQL
            await tx.$executeRaw`
                UPDATE biditems
                SET CurrentPrice = ${BidAmount}
                WHERE BidItemID = ${BidItemID};
            `;
        });

        return { success: true, message: 'Payment and bid processed successfully' };

    } catch (error: any) {
        console.error("Error processing payment and bid:", error.message || error);
        return { success: false, message: 'Failed to process payment and bid', error };
    } finally {
        await prisma.$disconnect();
    }
}

export async function updatePaymentAndPlaceBid(
    BidItemID: number,
    BidAmount: number
) {
    const user = await getCurrentUser();
    if (!user) {
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

            // Check if the update affected any rows
            if (updatedPayment === 0) {
                throw new Error('No existing payment record found for update');
            }

            // Insert a new bid entry in the bids table using raw SQL
            await tx.$executeRaw`
                INSERT INTO bids (BidItemID, UserID, BidAmount)
                VALUES (${BidItemID}, ${userId}, ${BidAmount});
            `;

            // Update the CurrentPrice field in the biditems table using raw SQL
            await tx.$executeRaw`
                UPDATE biditems
                SET CurrentPrice = ${BidAmount}
                WHERE BidItemID = ${BidItemID};
            `;
        });

        return { success: true, message: 'Payment, bid, and bid item updated successfully' };

    } catch (error: any) {
        console.error("Error updating payment and placing bid:", error.message || error);
        return { success: false, message: 'Failed to update payment and place bid', error };
    } finally {
        await prisma.$disconnect();
    }
}



export async function checkExistingPaymentAndBid(
    BidItemID: number,
) {
    const user = await getCurrentUser();
    if (!user) {
        return { error: "User not authenticated" };
    }

    const UserID = Number(user.id);
    const roleId = 3; // Adjust role if necessary
    const prisma = getPrismaClientForRole(roleId);

    try {
        // Check for an existing payment for this user and bid item using raw SQL
        const existingPayment = await prisma.$queryRaw<
            Array<{
                PaymentID: number;
                PaymentDate: Date;
            }>
        >`
            SELECT 
                PaymentID, 
                PaymentDate 
            FROM 
                payments 
            WHERE 
                UserID = ${UserID} 
                AND BidItemID = ${BidItemID} 
            LIMIT 1;`;

        // If a payment entry exists, return it to determine user action (update or continue)
        if (existingPayment.length > 0) {
            return {
                exists: true,
                paymentData: {
                    PaymentID: existingPayment[0].PaymentID,
                    paymentDate: existingPayment[0].PaymentDate,
                },
            };
        }

        // If no payment entry exists, return flag to prompt new payment entry
        return { exists: false };
    } catch (error: any) {
        console.error("Error checking existing payment:", error.message || error);
        return { error: "Error checking payment status" };
    } finally {
        await prisma.$disconnect();
    }
}

