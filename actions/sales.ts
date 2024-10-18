'use server';
import getPrismaClientForRole from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { writeGeneralLog } from '@/utils/logging'; // Import logging utility

export async function getSalesDataForUser() {
    const prisma = getPrismaClientForRole(2);
    const user = await getCurrentUser();

    if (!user || !user.id) {
        writeGeneralLog('general.log', 'Fetch', 'Sales Data', 'Guest', 'Fetch', 'Failure', 'User not authenticated');
        console.warn('User not authenticated');
        return null;
    }

    const userId = user.id;

    try {
        console.log(`Fetching bid items for UserID: ${userId}`);

        const items = await prisma.$queryRaw<Array<{
            BidItemID: number;
            ItemName: string;
            ItemDescription: string;
            category: string;
            CurrentPrice: number;
            BidEndTime: string;
            Status: string;
            deliver_states: number;
        }>>`
            SELECT 
                BidItemID, 
                ItemName, 
                ItemDescription, 
                category, 
                CurrentPrice, 
                BidEndTime, 
                Status,
                deliver_states
            FROM 
                biditems 
            WHERE 
                UserID = ${userId} AND 
                Status = 'Completed' AND 
                deliver_states = 0;
        `;

        writeGeneralLog('general.log', 'Fetch', 'Sales Data', user.email!, 'Fetch', 'Success', `${items.length} items fetched successfully`);
        console.log(`Items fetched: ${JSON.stringify(items)}`);
        return items;
    } catch (error: any) {
        writeGeneralLog('general.log', 'Fetch', 'Sales Data', user.email!, 'Fetch', 'Failure', `Error: ${error.message || error}`);
        console.error('Error fetching sales data:', error.message || error);
        throw new Error('Failed to fetch sales data. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}

export const updateDeliveryState = async (id: string) => {
    const prisma = getPrismaClientForRole(2);
    const user = await getCurrentUser();

    if (!user || !user.id) {
        writeGeneralLog('general.log', 'Update', 'Delivery State', 'Guest', 'Update', 'Failure', 'User not authenticated');
        return { error: 'User not authenticated' };
    }

    try {
        console.log(`Updating delivery state for BidItemID: ${id}`);

        const result = await prisma.$executeRaw`
            UPDATE biditems 
            SET deliver_states = 1
            WHERE BidItemID = ${id};
        `;

        writeGeneralLog('general.log', 'Update', 'Delivery State', user.email!, 'Update', 'Success', `Delivery state updated for BidItemID: ${id}`);
        console.log(`Delivery state updated for BidItemID: ${id}`);
        return result;
    } catch (error: any) {
        writeGeneralLog('general.log', 'Update', 'Delivery State', user.email!, 'Update', 'Failure', `Error: ${error.message || error}`);
        console.error('Error updating delivery state:', error.message || error);
        throw new Error('Failed to update delivery state. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
};
