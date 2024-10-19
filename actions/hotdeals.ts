// actions/hotdeals.ts

import { Prisma } from '@prisma/client';
import getPrismaClientForRole from '@/lib/db';
import { writeGeneralLog } from '@/utils/logging'; // Use general logging
import { getCurrentUser } from '@/lib/auth';

// Function to fetch hot deals for the customer
export async function getHotDealsForCustomer() {
    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);
    const user = await getCurrentUser();
    const userType = user?.role === 3 ? 'Customer' : 'Guest'; // Get the user type

    try {
        console.log('Fetching hot deals...');
        
        const result = await prisma.$queryRaw<
            Array<{
                BidItemID: number;
                ItemName: string;
                category: string;
                Image: Buffer | null;
                CurrentPrice: number;
                BidEndTime: string;
                BidCount: number;
            }>
        >(
            Prisma.sql`SELECT 
                bi.BidItemID, 
                bi.ItemName, 
                bi.category, 
                bi.Image, 
                bi.CurrentPrice, 
                bi.BidEndTime,
                COUNT(b.BidID) AS BidCount
            FROM 
                biditems bi
            LEFT JOIN 
                bids b ON bi.BidItemID = b.BidItemID
            GROUP BY 
                bi.BidItemID, bi.ItemName, bi.category, bi.Image, bi.CurrentPrice, bi.BidEndTime
            HAVING 
                COUNT(b.BidID) > 3 
                AND bi.CurrentPrice < 1003
            LIMIT 8`
        );

        if (!result || result.length === 0) {
            // Log when no hot deals are found
            if (user) {
                writeGeneralLog('general.log', 'Fetch', 'Hot Deals', user.email!, 'Fetch Hot Deals', 'Success', 'No hot deals found.');
            } else {
                writeGeneralLog('general.log', 'Fetch', 'Hot Deals', 'unknown', 'Fetch Hot Deals', 'Success', 'No hot deals found.');
            }
            console.warn(`No hot deals found.`);
            return [];
        }
        
        // Log successful fetching of hot deals
        if (user) {
            writeGeneralLog('general.log', 'Fetch', 'Hot Deals', user.email!, 'Fetch Hot Deals', 'Success', `${result.length} hot deals fetched successfully.`);
        } else {
            writeGeneralLog('general.log', 'Fetch', 'Hot Deals', 'unknown', 'Fetch Hot Deals', 'Success', `${result.length} hot deals fetched successfully.`);
        }

        return result.map((product) => ({
            BidItemID: product.BidItemID,
            ItemName: product.ItemName,
            category: product.category,
            Image: product.Image ? Buffer.from(product.Image).toString('base64') : null,
            CurrentPrice: product.CurrentPrice,
            BidEndTime: product.BidEndTime,
            BidCount: product.BidCount,
        }));
    } catch (error: any) {
        // Log the failure in fetching hot deals
        writeGeneralLog('general.log', 'Fetch', 'Hot Deals', user?.email ?? 'unknown', 'Fetch Hot Deals', 'Failure', `Failed to fetch hot deals: ${error.message || error}`);
        console.error('Error fetching hot deals:', error.message || error);
        throw new Error('Failed to fetch hot deals. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}
