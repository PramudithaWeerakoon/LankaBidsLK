import getPrismaClientForRole from '@/lib/db'; // Import role-based Prisma client function
import { subHours } from 'date-fns'; // For date manipulation

export async function getHotDealsForCustomer() {
    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId); // Get PrismaClient for the customer role

    try {
        // Define a price threshold and time window for hot deals
        const priceThreshold = 50; // Example: Hot deals are items priced under $50
        const bidEndTimeWindow = subHours(new Date(), 24); // Example: Deals ending in less than 24 hours

        // Using template literals for a raw SQL query to fetch hot deals
        const result = await prisma.$queryRaw<
            Array<{
                BidItemID: number;
                ItemName: string;
                category: string;
                Image: Buffer | null;
                CurrentPrice: number;
                BidEndTime: string;
            }>
        >`
            SELECT 
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
                COUNT(b.BidID) < 4
            LIMIT 4`;

        // Check if any hot deals were found
        if (!result || result.length === 0) {
            console.warn(`No hot deals found.`);
            return []; // Return an empty array if no deals are found
        }

        // Process the fetched hot deals
        const processedDeals = result.map((product) => ({
            BidItemID: product.BidItemID,
            ItemName: product.ItemName,
            category: product.category,
            Image: product.Image ? Buffer.from(product.Image).toString('base64') : null,
            CurrentPrice: product.CurrentPrice,
            BidEndTime: product.BidEndTime,
        }));

        return processedDeals;
    } catch (error: any) {
        // Enhanced error logging
        console.error('Error fetching hot deals:', error.message || error);
        console.error('Detailed error:', error); // Log the entire error object for more details
        throw new Error('Failed to fetch hot deals. Please try again later.');
    } finally {
        await prisma.$disconnect(); // Ensure the client is disconnected
    }
}
