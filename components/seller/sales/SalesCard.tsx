// SalesCard.tsx
'use client'; // Ensure this is a client-side component

import { useRouter } from 'next/navigation'; // Use `next/navigation` for the App directory
import React from 'react';

type SalesCardProps = {
    bidItemID: string;
    itemName: string;
    itemDescription: string;
    category: string;
    currentPrice: number;
    bidEndTime: string;
    status: string;
    deliveryState: number;
    onUpdateDeliveryState: (id: string) => void;
};

const SalesCard: React.FC<SalesCardProps> = ({
    bidItemID,
    itemName,
    itemDescription,
    category,
    currentPrice,
    bidEndTime,
    status,
    deliveryState,
    onUpdateDeliveryState,
}) => {
    const router = useRouter();

    return (
        <div className="border p-4 rounded shadow">
            <h2
                className="text-lg font-semibold cursor-pointer"
                onClick={() => router.push(`/bid/${bidItemID}`)} // Navigate to the bid details page
            >
                {itemName}
            </h2>
            <p className="text-gray-600">{itemDescription}</p>
            <p className="text-gray-700">Category: {category}</p>
            <p className="text-green-600 font-semibold">Price: ${currentPrice.toFixed(2)}</p>
            <p className="text-gray-500">Bid Ends: {new Date(bidEndTime).toLocaleString()}</p>
            <p className={`text-sm font-medium ${status === 'Completed' ? 'text-green-500' : 'text-red-500'}`}>
                Status: {status}
            </p>
            {deliveryState === 0 && (
                <button onClick={() => onUpdateDeliveryState(bidItemID)} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Mark as Delivered
                </button>
            )}
            {deliveryState === 1 && (
                <p className="text-green-500 font-semibold">Item Delivered</p>
            )}
        </div>
    );
};

export default SalesCard;
