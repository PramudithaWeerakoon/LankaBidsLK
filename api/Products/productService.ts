import { createConnection } from '../../lib/db';
import { RowDataPacket } from 'mysql2';

// Define the structure of the product
interface Product {
  BidItemID: number;
  ItemName: string;
  CurrentPrice: number;
  ImageURL: string;
}

// Fetch products for a specific role (e.g., Customer with roleId 3)
export const getProducts = async (roleId: number): Promise<Product[]> => {
  const connection = await createConnection(roleId);

  const [rows] = await connection.query<RowDataPacket[]>(
    'SELECT BidItemID, ItemName, CurrentPrice, ImageURL FROM BidItem WHERE Status = "active"'
  );

  // Close the connection after use
  await connection.end();

  return rows as Product[];
};
