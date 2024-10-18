'use server';
import getPrismaClientForRole from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function getSalesDataForUser() {
    const prisma = getPrismaClientForRole(2);
    const user = await getCurrentUser();

    if (!user || !user.id) {
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

        console.log(`Items fetched: ${JSON.stringify(items)}`);
        return items;
    } catch (error: any) {
        console.error('Error fetching sales data:', error.message || error);
        throw new Error('Failed to fetch sales data. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
}

export const updateDeliveryState = async (id: string) => {
    const prisma = getPrismaClientForRole(2);

    try {
        console.log(`Updating delivery state for BidItemID: ${id}`);

        const result = await prisma.$executeRaw`
            UPDATE biditems 
            SET deliver_states = 1
            WHERE BidItemID = ${id};
        `;

        console.log(`Delivery state updated for BidItemID: ${id}`);
        return result;
    } catch (error: any) {
        console.error('Error updating delivery state:', error.message || error);
        throw new Error('Failed to update delivery state. Please try again later.');
    } finally {
        await prisma.$disconnect();
    }
};
