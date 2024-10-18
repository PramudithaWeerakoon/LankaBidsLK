"use server";
import { getCurrentUser } from "@/lib/auth";
import { productSchema, ProductInput } from "@/schemas";
import getPrismaClientForRole from "@/lib/db";
import { convertToPlainObject } from "@/utils/convertToPlainObject";

// Define the BidItem type
type BidItem = {
  BidItemID: number;
  ItemName: string;
  ItemDescription: string;
  category: string;
  StartingPrice: number;
  CurrentPrice: number;
  MinIncrement: number;
  BidEndTime: string | null;
  Status: string;
  Image: string | null;
};

// Create a new product (bid item)
export async function createProduct(data: ProductInput) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "User not authenticated" };
  }

  const parsedData = productSchema.safeParse(data);
  if (!parsedData.success) {
    const errorMessage = parsedData.error.errors.map((e) => e.message).join(", ");
    return { success: false, message: `Validation failed: ${errorMessage}` };
  }

  const prisma = getPrismaClientForRole(2);

  // Remove the data URL prefix if present and if Image exists
  const imageData = parsedData.data.Image
    ? parsedData.data.Image.replace(/^data:image\/\w+;base64,/, "")
    : null;

  try {
    // Use raw SQL to insert the product
    await prisma.$executeRaw`
      INSERT INTO biditems (UserID, ItemName, ItemDescription, category, StartingPrice, CurrentPrice, MinIncrement, BidEndTime, Status, Image)
      VALUES (${parseInt(user.id!)}, ${parsedData.data.ItemName}, ${parsedData.data.ItemDescription}, ${parsedData.data.category}, 
              ${parsedData.data.StartingPrice}, ${parsedData.data.CurrentPrice || parsedData.data.StartingPrice}, ${parsedData.data.MinIncrement}, 
              ${new Date(parsedData.data.BidEndTime)}, ${parsedData.data.Status}, ${imageData ? Buffer.from(imageData, "base64") : null});
    `;

    // Get the last inserted ID
    const [{ lastId }] = await prisma.$queryRaw<{ lastId: number }[]>`
      SELECT LAST_INSERT_ID() as lastId;
    `;

    // Fetch the inserted product
    const product = await prisma.$queryRaw<BidItem[]>`
      SELECT * FROM biditems WHERE BidItemID = ${lastId};
    `;

    return { success: true, message: "Product created successfully", product: convertToPlainObject(product[0]) };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, message: "Failed to create product", error };
  } finally {
    await prisma.$disconnect();
  }
}

// Fetch all bid items for the authenticated seller
export async function getBidItemsByUser() {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "User not authenticated", items: [] };
  }

  const prisma = getPrismaClientForRole(2);

  try {
    // Use raw SQL to fetch bid items
    const items = await prisma.$queryRaw<BidItem[]>`
      SELECT BidItemID, ItemName, ItemDescription, category, StartingPrice, CurrentPrice, MinIncrement, BidEndTime, Status, Image
      FROM biditems
      WHERE UserID = ${parseInt(user.id!)};
    `;

    const formattedItems: BidItem[] = items.map(item => ({
      ...item,
      ItemDescription: item.ItemDescription ?? "",
      category: item.category ?? "",
      StartingPrice: parseFloat(item.StartingPrice.toString()),
      CurrentPrice: item.CurrentPrice ? parseFloat(item.CurrentPrice.toString()) : 0,
      MinIncrement: parseFloat(item.MinIncrement.toString()),
      BidEndTime: item.BidEndTime ? new Date(item.BidEndTime).toISOString() : null,
      Status: item.Status ?? "Open",
      Image: item.Image ? `data:image/jpeg;base64,${Buffer.from(item.Image).toString('base64')}` : null
    }));

    return { success: true, items: formattedItems };
  } catch (error) {
    console.error("Error fetching bid items:", error);
    return { success: false, message: "Failed to fetch bid items", items: [] };
  } finally {
    await prisma.$disconnect();
  }
}

// Update an existing product
export async function updateProduct(productId: number, data: ProductInput) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "User not authenticated" };
  }

  // Validate the input data using Zod schema
  const parsedData = productSchema.safeParse(data);
  if (!parsedData.success) {
    const errorMessage = parsedData.error.errors.map((error) => error.message).join(", ");
    return { success: false, message: `Validation failed: ${errorMessage}` };
  }

  const prisma = getPrismaClientForRole(2);

  try {
    // Prepare the image data
    const imageData = parsedData.data.Image
      ? parsedData.data.Image.replace(/^data:image\/\w+;base64,/, "")
      : null;

    // Use raw SQL to update the product
    await prisma.$executeRaw`
      UPDATE biditems
      SET 
        ItemName = ${parsedData.data.ItemName},
        ItemDescription = ${parsedData.data.ItemDescription},
        category = ${parsedData.data.category},
        StartingPrice = ${parsedData.data.StartingPrice},
        CurrentPrice = ${parsedData.data.CurrentPrice ?? parsedData.data.StartingPrice},
        MinIncrement = ${parsedData.data.MinIncrement},
        BidEndTime = ${new Date(parsedData.data.BidEndTime)},
        Status = ${parsedData.data.Status},
        Image = ${imageData ? Buffer.from(imageData, "base64") : null}
      WHERE 
        BidItemID = ${productId} AND
        UserID = ${parseInt(user.id as string)};
    `;

    // Fetch the updated product
    const product = await prisma.$queryRaw<BidItem[]>`
      SELECT * FROM biditems WHERE BidItemID = ${productId} AND UserID = ${parseInt(user.id!)};
    `;

    return { success: true, message: "Product updated successfully", product: convertToPlainObject(product[0]) };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, message: "Failed to update product", error };
  } finally {
    await prisma.$disconnect();
  }
}

// Delete a product (bid item) by ID
export async function deleteProduct(productId: number) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "User not authenticated" };
  }

  const prisma = getPrismaClientForRole(2);

  try {
    // Use raw SQL to delete the product
    await prisma.$executeRaw`
      DELETE FROM biditems
      WHERE BidItemID = ${productId} AND UserID = ${parseInt(user.id!)};
    `;

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Failed to delete product", error };
  } finally {
    await prisma.$disconnect();
  }
}
