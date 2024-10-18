// actions/searchActions.ts

import { Prisma } from '@prisma/client';
import getPrismaClientForRole from '@/lib/db';
import { SearchProductsSchema } from '@/schemas'; // Import SearchProductsSchema from validation schema
import { writeGeneralLog } from '@/utils/logging'; // Import the general logging utility
import { getCurrentUser } from '@/lib/auth'; // To fetch the current user

// Function to search products by name or category
export async function searchProducts(searchTerm: string) {
    const roleId = 3;
    const prisma = getPrismaClientForRole(roleId);
    const user = await getCurrentUser(); // Fetch the current user
    const userType = user?.role === 3 ? 'Customer' : 'Guest'; // Determine if user is customer or guest

    // Validate the search term
    try {
        const validationInput = {
            ItemName: searchTerm,
            category: undefined,
        };

        SearchProductsSchema.parse(validationInput);
        writeGeneralLog('general.log', 'Search', 'Products', user?.email || 'Guest', 'Search', 'Success', `Search term "${searchTerm}" validated successfully`);
    } catch (error) {
        writeGeneralLog('general.log', 'Search', 'Products', user?.email || 'Guest', 'Search', 'Failure', `Validation error: ${(error as any).message || error}`);
        console.error("Validation error:", error);
        throw new Error("Invalid search term. Please provide a valid name or category.");
    }

    try {
        console.log('Executing search query for term:', searchTerm);
        writeGeneralLog('general.log', 'Search', 'Products', user?.email || 'Guest', 'Search', 'Info', `Executing search query for term "${searchTerm}"`);

        const result = await prisma.$queryRaw<
            Array<{
                BidItemID: number;
                ItemName: string;
                category: string;
                Image: Buffer | null;
                CurrentPrice: number;
                BidEndTime: string;
            }>
        >(
            Prisma.sql`SELECT 
                bi.BidItemID, 
                bi.ItemName, 
                bi.category, 
                bi.Image, 
                bi.CurrentPrice, 
                bi.BidEndTime
            FROM 
                biditems bi
            WHERE 
                bi.ItemName LIKE CONCAT('%', ${searchTerm}, '%')
                OR bi.category LIKE CONCAT('%', ${searchTerm}, '%')
            LIMIT 8`
        );

        console.log('Search query result:', result);

        if (!result || result.length === 0) {
            writeGeneralLog('general.log', 'Search', 'Products', user?.email || 'Guest', 'Search', 'Success', `No search results found for term "${searchTerm}"`);
            console.warn(`No search results found for term: ${searchTerm}`);
            return [];
        }

        writeGeneralLog('general.log', 'Search', 'Products', user?.email || 'Guest', 'Search', 'Success', `${result.length} search results fetched for term "${searchTerm}"`);

        return result.map((product) => ({
            BidItemID: product.BidItemID,
            ItemName: product.ItemName,
            category: product.category,
            Image: product.Image ? Buffer.from(product.Image).toString('base64') : null,
            CurrentPrice: product.CurrentPrice,
            BidEndTime: product.BidEndTime,
        }));
    } catch (error) {
        writeGeneralLog('general.log', 'Search', 'Products', user?.email || 'Guest', 'Search', 'Failure', `Error fetching search results: ${(error as any).message || error}`);
        console.error('Error fetching search results:', error);
        throw new Error('Failed to fetch search results.');
    } finally {
        await prisma.$disconnect();
    }
}
