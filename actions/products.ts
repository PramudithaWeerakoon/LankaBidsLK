"use server";

import getPrismaClientForRole from '@/lib/db'; // Import role-based Prisma client function
import { writeGeneralLog } from '@/utils/logging'; // Import the general logging utility
import { getCurrentUser } from '@/lib/auth';

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
            writeGeneralLog('general.log', 'Fetch', 'Products', user?.email || 'Guest', 'Fetch', 'Failure', 'No products found');
            console.warn(`No products found.`);
            return []; // Return an empty array if no products are found
        }

        writeGeneralLog('general.log', 'Fetch', 'Products', user?.email || 'Guest', 'Fetch', 'Success', `${result.length} products fetched successfully`);

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
        writeGeneralLog('general.log', 'Fetch', 'Products', user?.email || 'Guest', 'Fetch', 'Failure', `Error: ${error.message || error}`);
        console.error('Error fetching products:', error.message || error);
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
            writeGeneralLog('general.log', 'Fetch', 'Products', user?.email || 'Guest', 'Fetch', 'Failure', `No products found matching the name: ${itemName}`);
            console.warn(`No products found matching the name: ${itemName}`);
            return [];
        }

        writeGeneralLog('general.log', 'Fetch', 'Products', user?.email || 'Guest', 'Fetch', 'Success', `${result.length} products matching ${itemName} fetched successfully`);

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
        writeGeneralLog('general.log', 'Fetch', 'Products', user?.email || 'Guest', 'Fetch', 'Failure', `Error fetching products by name: ${error.message || error}`);
        console.error('Error fetching products:', error.message || error);
        throw new Error('Failed to fetch products by name. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}
