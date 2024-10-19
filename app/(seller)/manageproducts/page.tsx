'use client';
import { useState, useEffect, useRef } from "react";
import { createProduct, getBidItemsByUser, updateProduct, deleteProduct } from "@/actions/bidItemActions";
import { Table } from "@/components/ui/table"; // Import the Table component

export default function ManageProductsPage() {
  const [form, setForm] = useState({
    ItemName: "",
    ItemDescription: "",
    category: "",
    StartingPrice: 0,
    CurrentPrice: 0,
    MinIncrement: 1,
    BidEndTime: "",
    Status: "Open" as "Open" | "Closed",
    Image: "" as string | undefined,
    ImagePreview: "" as string | undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editableForm, setEditableForm] = useState<Partial<BidItem>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);
 
  interface BidItem {
    BidItemID: number;
    ItemName: string;
    ItemDescription: string | null;
    category: string | null;
    StartingPrice: number;
    CurrentPrice: number | null;
    MinIncrement: number;
    BidEndTime: string | null;
    Status: string | null;
    Image?: string | null;
  }

  const [bidItems, setBidItems] = useState<BidItem[]>([]);

  useEffect(() => {
    async function fetchBidItems() {
      try {
        const result = await getBidItemsByUser();
        if (result.success) {
          setBidItems(result.items as BidItem[]);
        } else {
          setError(result.message || "Failed to load bid items");
        }
      } catch (error) {
        console.error("Error fetching bid items:", error);
        setError("An error occurred while fetching bid items");
      }
    }
    fetchBidItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "StartingPrice" || name === "CurrentPrice" || name === "MinIncrement"
        ? parseFloat(value) || 0
        : name === "Status"
          ? (value as "Open" | "Closed")
          : value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setForm((prev) => ({
          ...prev,
          Image: result.startsWith("data:image/") ? result : `data:image/jpeg;base64,${result}`,
          ImagePreview: result.startsWith("data:image/") ? result : `data:image/jpeg;base64,${result}`
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, Image: undefined, ImagePreview: undefined }));
    }
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const result = await createProduct(form);
      if (result.success) {
        setForm({
          ItemName: "",
          ItemDescription: "",
          category: "",
          StartingPrice: 0,
          CurrentPrice: 0,
          MinIncrement: 1,
          BidEndTime: "",
          Status: "Open",
          Image: undefined,
          ImagePreview: undefined,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
        alert("Product added successfully!");
        const items = await getBidItemsByUser();
        setBidItems(items.items as BidItem[]);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError("Failed to add the product.");
    }
  };

  const handleEditClick = (item: BidItem) => {
    setEditingItemId(item.BidItemID);
    setEditableForm({
      ItemName: item.ItemName,
      ItemDescription: item.ItemDescription,
      category: item.category,
      StartingPrice: item.StartingPrice,
      CurrentPrice: item.CurrentPrice ?? item.StartingPrice, // Set to StartingPrice if CurrentPrice is null
      MinIncrement: item.MinIncrement,
      BidEndTime: item.BidEndTime ? new Date(item.BidEndTime).toISOString().slice(0, 16) : "",
      Status: item.Status,
      Image: item.Image
    });
  };
  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditableForm({});
  };

  const handleEditableChange = (key: string, value: string) => {
    setEditableForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditableForm((prev) => ({
          ...prev,
          Image: result.startsWith("data:image/") ? result : `data:image/jpeg;base64,${result}`,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editingItemId) return;
  
    try {
      // Construct the update object carefully to ensure numeric fields are parsed correctly
      const updatedData = {
        ItemName: editableForm.ItemName ?? "",
        ItemDescription: editableForm.ItemDescription ?? "",
        category: editableForm.category ?? "",
        StartingPrice: parseFloat(editableForm.StartingPrice?.toString() || "0"), // Ensure it's a number
        CurrentPrice: parseFloat(editableForm.CurrentPrice?.toString() || editableForm.StartingPrice?.toString() || "0"), // Fallback to StartingPrice if CurrentPrice is undefined
        MinIncrement: parseFloat(editableForm.MinIncrement?.toString() || "1"), // Ensure it's a number
        BidEndTime: editableForm.BidEndTime ?? "",
        Status: (editableForm.Status as "Open" | "Closed") ?? "Open",
        Image: editableForm.Image ? editableForm.Image : undefined // Only include Image if it's defined
      };
  
      const result = await updateProduct(editingItemId, updatedData);
  
      if (result.success) {
        // Update bid items list with new data
        setBidItems(bidItems.map(item => item.BidItemID === editingItemId
          ? { ...item, ...editableForm, Image: editableForm.Image ?? item.Image } as BidItem
          : item
        ));
        setEditingItemId(null);
        setEditableForm({});
        alert("Product updated successfully!");
      } else {
        // Display validation errors from the action file
        setError(result.message);
      }
    } catch (err) {
      console.error("Error in handleSave:", err);
      setError("Failed to save the product.");
    }
  };
  

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteProduct(id);
      if (result.success) {
        setBidItems(bidItems.filter(item => item.BidItemID !== id));
        alert("Product deleted successfully!");
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Error in handleDelete:", err);
      setError("Failed to delete the product.");
    }
  };

  // Define headers without redundant "Actions"
  const headers = [
    "Item Name", "Description", "Category", "Starting Price",
    "Current Price", "Min Increment", "Bid End Time", "Status", "Image"
  ];

  const rows = bidItems.map((item) => ({
    "Item Name": editingItemId === item.BidItemID ? (
      <input
        type="text"
        name="ItemName"
        value={editableForm.ItemName || ""}
        onChange={(e) => handleEditableChange("ItemName", e.target.value)}
        className="border p-1"
      />
    ) : item.ItemName,
    "Description": editingItemId === item.BidItemID ? (
      <input
        type="text"
        name="ItemDescription"
        value={editableForm.ItemDescription || ""}
        onChange={(e) => handleEditableChange("ItemDescription", e.target.value)}
        className="border p-1"
      />
    ) : item.ItemDescription,
    "Category": editingItemId === item.BidItemID ? (
      <input
        type="text"
        name="category"
        value={editableForm.category || ""}
        onChange={(e) => handleEditableChange("category", e.target.value)}
        className="border p-1"
      />
    ) : item.category,
    "Starting Price": editingItemId === item.BidItemID ? (
      <input
        type="number"
        name="StartingPrice"
        value={editableForm.StartingPrice || ""}
        onChange={(e) => handleEditableChange("StartingPrice", e.target.value)}
        className="border p-1"
      />
    ) : item.StartingPrice,
    "Current Price": editingItemId === item.BidItemID ? (
      <input
        type="number"
        name="CurrentPrice"
        value={editableForm.CurrentPrice || ""}
        onChange={(e) => handleEditableChange("CurrentPrice", e.target.value)}
        className="border p-1"
      />
    ) : item.CurrentPrice,
    "Min Increment": editingItemId === item.BidItemID ? (
      <input
        type="number"
        name="MinIncrement"
        value={editableForm.MinIncrement || ""}
        onChange={(e) => handleEditableChange("MinIncrement", e.target.value)}
        className="border p-1"
      />
    ) : item.MinIncrement,
    "Bid End Time": editingItemId === item.BidItemID ? (
      <input
        type="datetime-local"
        name="BidEndTime"
        value={editableForm.BidEndTime || ""}
        onChange={(e) => handleEditableChange("BidEndTime", e.target.value)}
        className="border p-1"
      />
    ) : item.BidEndTime ? new Date(item.BidEndTime).toLocaleString() : "N/A",
    "Status": editingItemId === item.BidItemID ? (
      <select
        name="Status"
        value={editableForm.Status || ""}
        onChange={(e) => handleEditableChange("Status", e.target.value)}
        className="border p-1"
      >
        <option value="Open">Open</option>
        <option value="Closed">Closed</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>
    ) : item.Status,
    "Image": editingItemId === item.BidItemID ? (
      <div>
        <input
          type="file"
          name="Image"
          onChange={handleFileEditChange}
          className="border p-1"
        />
        {editableForm.Image && (
          <img
            src={editableForm.Image}
            alt="Preview"
            width="50"
            className="mt-2"
          />
        )}
      </div>
    ) : item.Image ? <img src={item.Image} alt="Product" width="50" /> : "No Image",
    "Actions": editingItemId === item.BidItemID ? (
      <>
        <button onClick={handleSave} className="mr-2 bg-green-500 text-white px-2 py-1 rounded-full">Save</button>
        <button onClick={handleCancelEdit} className="my-1 bg-red-500 text-white px-2 py-1 rounded-full">Cancel</button>
      </>
    ) : (
      <>
        <button onClick={() => handleEditClick(item)} className="mr-2 bg-blue-500 text-white px-2 py-1 rounded-full">Edit</button>
        <button onClick={() => handleDelete(item.BidItemID)} className="my-1 bg-red-500 text-white px-2 py-1 rounded-full">Delete</button>
      </>
    ),
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Add Product</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Add Item Form */}
      <div className="form grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 mb-1">Item Name</label>
          <input
            type="text"
            name="ItemName"
            placeholder="Item Name"
            value={form.ItemName}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            name="ItemDescription"
            placeholder="Description"
            value={form.ItemDescription}
            onChange={handleInputChange}
            className="border p-2 w-full"
            rows={4}
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Starting Price</label>
          <input
            type="number"
            name="StartingPrice"
            placeholder="Starting Price"
            value={form.StartingPrice}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Current Price</label>
          <input
            type="number"
            name="CurrentPrice"
            placeholder="Current Price"
            value={form.CurrentPrice}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Min Increment</label>
          <input
            type="number"
            name="MinIncrement"
            placeholder="Min Increment"
            value={form.MinIncrement}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Bid End Time</label>
          <input
            type="datetime-local"
            name="BidEndTime"
            value={form.BidEndTime}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Status</label>
          <input
            type="text"
            name="Status"
            placeholder="Status"
            value={form.Status}
            onChange={handleInputChange}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Image</label>
          <input
            type="file"
            name="Image"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="border p-2 w-full"
          />
          {form.ImagePreview && (
            <img
              src={form.ImagePreview}
              alt="Preview"
              width="250"
              height="250"
              className="mt-2"
              onError={(e) => {
                e.currentTarget.src = "";
              }}
            />
          )}
        </div>
        <div className="col-span-2">
          <button onClick={handleSubmit} className="w-full border p-2 bg-blue-500 text-white">
            Add Product
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Your Bid Items</h2>
   <div className="max-h-100 overflow-y-auto"> {/* NEW: Tailwind scrollable wrapper */}
     <Table headers={headers} rows={rows} />
   </div>
    </div>
  );
}
