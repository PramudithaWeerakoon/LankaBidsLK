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
    const product = await prisma.biditems.create({
      data: {
        UserID: user.id ? parseInt(user.id) : 0,
        ItemName: parsedData.data.ItemName,
        ItemDescription: parsedData.data.ItemDescription,
        category: parsedData.data.category,
        StartingPrice: parsedData.data.StartingPrice,
        CurrentPrice: parsedData.data.CurrentPrice || parsedData.data.StartingPrice,
        MinIncrement: parsedData.data.MinIncrement,
        BidEndTime: new Date(parsedData.data.BidEndTime),
        Status: parsedData.data.Status,
        ...(imageData && { Image: Buffer.from(imageData, "base64") }), // Only add Image if it exists
      },
    });

    return { success: true, message: "Product created successfully", product: convertToPlainObject(product) };
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
    const items = await prisma.biditems.findMany({
      where: { UserID: user.id ? parseInt(user.id) : 0 },
      select: {
        BidItemID: true,
        ItemName: true,
        ItemDescription: true,
        category: true,
        StartingPrice: true,
        CurrentPrice: true,
        MinIncrement: true,
        BidEndTime: true,
        Status: true,
        Image: true,
      },
    });

    const formattedItems: BidItem[] = items.map(item => ({
      ...item,
      ItemDescription: item.ItemDescription ?? "", // Replace null with empty string
      category: item.category ?? "",               // Replace null with empty string
      StartingPrice: parseFloat(item.StartingPrice.toString()),
      CurrentPrice: item.CurrentPrice ? parseFloat(item.CurrentPrice.toString()) : 0, // Replace null with 0
      MinIncrement: parseFloat(item.MinIncrement.toString()),
      BidEndTime: item.BidEndTime ? item.BidEndTime.toISOString() : null,
      Status: item.Status ?? "Open",               // Default to "Open" if null
      Image: item.Image ? `data:image/jpeg;base64,${Buffer.from(item.Image).toString('base64')}` : null
    }));

    //console.log("Image Data Sent to Frontend with Prefix:", formattedItems.map(item => item.Image));

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
    // Generate a readable error message if validation fails
    const errorMessage = parsedData.error.errors.map((error) => error.message).join(", ");
    return { success: false, message: `Validation failed: ${errorMessage}` };
  }

  const prisma = getPrismaClientForRole(2);

  try {
    // Update product with validated data
    const product = await prisma.biditems.update({
      where: {
        BidItemID: productId,
        UserID: user.id ? parseInt(user.id) : 0,
      },
      data: {
        ItemName: parsedData.data.ItemName,
        ItemDescription: parsedData.data.ItemDescription,
        category: parsedData.data.category,
        StartingPrice: parsedData.data.StartingPrice,
        CurrentPrice: parsedData.data.CurrentPrice ?? parsedData.data.StartingPrice,
        MinIncrement: parsedData.data.MinIncrement,
        BidEndTime: new Date(parsedData.data.BidEndTime),
        Status: parsedData.data.Status,
        Image: parsedData.data.Image ? Buffer.from(parsedData.data.Image.replace(/^data:image\/\w+;base64,/, ""), "base64") : null,
      },
    });

    return { success: true, message: "Product updated successfully", product: convertToPlainObject(product) };
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
    await prisma.biditems.delete({
      where: {
        BidItemID: productId,
        UserID: user.id ? parseInt(user.id) : 0,
      },
    });

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Failed to delete product", error };
  } finally {
    await prisma.$disconnect();
  }
}
