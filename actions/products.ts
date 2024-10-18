import getPrismaClientForRole from '@/lib/db'; // Import role-based Prisma client function
import { writeLogproduct } from '@/utils/logging'; // Import the logging utility
import { getCurrentUser } from '@/lib/auth';
import { write } from 'fs';

export async function getProductsForCustomer() {
    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId); // Get PrismaClient for the customer role
    const user = await getCurrentUser(); // Get the current user
    const userId = user ? parseInt(user.id!) : 0; // Get the UserID
    const userType = user?.role === 3 ? 'Customer' : 'Guest'; // Get the user type
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
                biditems`; // Fetch all products

        // Check if any products were found
        if (!result || result.length === 0) {
            writeLogproduct('products.log', userType, user.email!,  'Fetch', 'Failure', 'No products found.'); // Log the failure
            console.warn(`No products found.`);
            return []; // Return an empty array if no products are found
        }
        writeLogproduct('products.log', userType, user.email!, 'Fetch', 'Success', `${result.length} Products Fetched successfully.`); // Log the success
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
        writeLogproduct('products.log', userType, user.email!, 'Fetch', 'Failure', `Error: ${error.message || error}`); // Log the error
        console.error('Error fetching products:', error.message || error);
        console.error('Detailed error:', error); // Log the entire error object for more details
        throw new Error('Failed to fetch products. Please try again later.');
    } finally {
        await prisma.$disconnect(); // Ensure the client is disconnected
    }
}
export async function getProductsByName(itemName: string) {
    const roleId = 3; // Customer Role ID
    const prisma = getPrismaClientForRole(roleId);
    const user = await getCurrentUser(); // Get the current user
    const userId = user ? parseInt(user.id!) : 0; // Get the UserID
    const userType = user?.role === 3 ? 'Customer' : 'Guest'; // Get the user type

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
                BidItemID, 
                ItemName, 
                category, 
                Image, 
                CurrentPrice, 
                BidEndTime 
            FROM 
                biditems 
            WHERE 
                ItemName LIKE ${'%' + itemName + '%'};`; // Filter by ItemName with a LIKE clause

        if (!result || result.length === 0) {
            writeLogproduct('products.log', userType, user.email!, 'Fetch', 'Failure', `No products found matching the name: ${itemName}`);
            alert(`No products found matching the name: ${itemName}`);
            console.warn(`No products found matching the name: ${itemName}`);
            return [];
        }
        alert(`${result.length} Products Fetched successfully.`);
        writeLogproduct('products.log', userType, user.email!, 'Fetch', 'Success', `${itemName} Fetched successfully.`);

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
        console.error('Error fetching products:', error.message || error);
        throw new Error('Failed to fetch products by name. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}