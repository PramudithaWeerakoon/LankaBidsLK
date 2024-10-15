// product.tsx
"use client";

import React, { useState } from 'react';
import { getProductsByName } from '@/actions/products';
import Card from '@/components/customer/card/card'; // Import the Card component

const Products = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBidItems, setFilteredBidItems] = useState([]);

    const handleSearch = async () => {
        try {
            const bidItems = await getProductsByName(searchTerm); // Fetch items by name
            console.log('bidItems:', bidItems);
            alert('Items fetched successfully!');
            const activeBidItems = bidItems.filter(item => {
                const currentTime = new Date().getTime();
                const bidEndTime = new Date(item.BidEndTime).getTime();
                return bidEndTime > currentTime;
            });
            setFilteredBidItems(activeBidItems);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    return (
        <div className="flex flex-col items-center py-5">
            {/* Search bar and button */}
            <div className="flex items-center mb-5">
                <input
                    type="text"
                    placeholder="Search for items"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded-md mr-2"
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onSubmit={handleSearch}
                >
                    Search
                </button>
            </div>

            {/* Display filtered bid items using Card component */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBidItems.map(item => (
                    <Card
                        key={item.BidItemID}
                        bidItemID={item.BidItemID}
                        image={item.Image ? `data:image/jpeg;base64,${item.Image}` : null}
                        itemName={item.ItemName}
                        category={item.category}
                        currentPrice={item.CurrentPrice}
                        bidEndTime={item.BidEndTime}
                    />
                ))}
            </div>
        </div>
    );
};

export default Products;
