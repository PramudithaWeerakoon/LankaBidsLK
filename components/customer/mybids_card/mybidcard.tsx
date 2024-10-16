// components/customer/mybids_card/mybidcard.tsx
"use client";

import React from 'react';
import { deleteBid } from '@/actions/mybids';

interface MyBidCardProps {
    bidID: string;
    bidItemID: string;
    userID: string;
    image: string;
    itemName: string;
    itemDescription: string;
    category: string;
    currentPrice: number;
    bidEndTime: string;
    bidAmount: number;
    bidTime: string;
    status: string;
    onDelete: (bidID: string) => void;
}

const MyBidCard: React.FC<MyBidCardProps> = ({
    bidID,
    bidItemID,
    userID,
    image,
    itemName,
    itemDescription,
    category,
    currentPrice,
    bidEndTime,
    bidAmount,
    bidTime,
    status,
}) => {
    const handleDelete = async () => {
        try {
            await deleteBid(Number(bidID));
            window.location.reload(); // Reload to reflect updated list
        } catch (error) {
            console.error('Error deleting bid:', error);
        }
    };

    return (
        <div className="bg-white shadow-md border border-gray-200 rounded-lg overflow-hidden transition-transform hover:scale-105 transform duration-200">
            <img
                src={image}
                alt={itemName}
                className="w-full h-48 object-cover"
            />
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {itemName}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{itemDescription}</p>
                
                <div className="mb-4">
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">Category:</span> {category}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">Current Price:</span> ${currentPrice}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">Bid End Time:</span> {new Date(bidEndTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">Your Bid:</span> ${bidAmount}
                    </p>
                    <p className="text-sm text-gray-500">
                        <span className="font-semibold">Bid Time:</span> {new Date(bidTime).toLocaleString()}
                    </p>
                    <p className={`text-sm font-semibold mb-2 ${status === 'Accepted' || status === 'Pending' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {status}
                     </p>
                </div>

                <button
                    onClick={handleDelete}
                    className="w-full bg-red-500 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors duration-200"
                >
                    Delete Bid
                </button>
            </div>
        </div>
    );
};

export default MyBidCard;
