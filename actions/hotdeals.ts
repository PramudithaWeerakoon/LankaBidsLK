// src/actions/hotdeals.ts

import getPrismaClientForRole from '@/lib/db';

// Function to fetch hot deals for the customer
export async function getHotDealsForCustomer() {
    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);

    try {
        // Fetch items that meet the criteria: bids > 5 and CurrentPrice < 1003
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
                COUNT(b.BidID) > 3 
                AND bi.CurrentPrice < 1003
            LIMIT 8`;

        if (!result || result.length === 0) {
            console.warn(`No hot deals found.`);
            return [];
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
        console.error('Error fetching hot deals:', error.message || error);
        throw new Error('Failed to fetch hot deals. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}

// New function to search products by name or category
export async function searchProducts(searchTerm: string) {
    const roleId = 3;
    const prisma = getPrismaClientForRole(roleId);

    try {
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
                bi.BidEndTime 
            FROM 
                biditems bi
            WHERE 
                bi.ItemName ILIKE '%' || ${searchTerm} || '%'
                OR bi.category ILIKE '%' || ${searchTerm} || '%'
            LIMIT 8`;

        if (!result || result.length === 0) {
            console.warn(`No search results found for term: ${searchTerm}`);
            return [];
        }

        return result.map((product) => ({
            BidItemID: product.BidItemID,
            ItemName: product.ItemName,
            category: product.category,
            Image: product.Image ? Buffer.from(product.Image).toString('base64') : null,
            CurrentPrice: product.CurrentPrice,
            BidEndTime: product.BidEndTime,
        }));
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw new Error('Failed to fetch search results.');
    } finally {
        await prisma.$disconnect();
    }
    
}
