import getPrismaClientForRole from '@/lib/db'; // Import role-based Prisma client function

export async function getProductsForCustomer() {
    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId); // Get PrismaClient for the customer role

    try {
        // Using template literals for a raw SQL query
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
                BidItemID, 
                ItemName, 
                category, 
                Image, 
                CurrentPrice, 
                BidEndTime 
            FROM 
                biditems`; // Removed the UserID filter

        // Check if any products were found
        if (!result || result.length === 0) {
            console.warn(`No products found.`);
            return []; // Return an empty array if no products are found
        }

        // Process the fetched products
        const processedProducts = result.map((product) => ({
            BidItemID: product.BidItemID,
            ItemName: product.ItemName,
            category: product.category,
            Image: product.Image ? Buffer.from(product.Image).toString('base64') : null,
            CurrentPrice: product.CurrentPrice,
            BidEndTime: product.BidEndTime,
        }));

        return processedProducts;
    } catch (error: any) {
        // Enhanced error logging
        console.error('Error fetching products:', error.message || error);
        console.error('Detailed error:', error); // Log the entire error object for more details
        throw new Error('Failed to fetch products. Please try again later.');
    } finally {
        await prisma.$disconnect(); // Ensure the client is disconnected
    }
}


