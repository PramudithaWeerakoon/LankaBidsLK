"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface CardProps {
    bidItemID: number;
    image: string | null;
    itemName: string;
    category: string;
    currentPrice: number;
    bidEndTime: string;
}

const Card: React.FC<CardProps> = ({ bidItemID, image, itemName, category, currentPrice, bidEndTime }) => {
    const router = useRouter();

    const calculateTimeLeft = () => {
        const endTime = new Date(bidEndTime).getTime();
        const now = new Date().getTime();
        return endTime - now;
    };

    const timeLeft = calculateTimeLeft();

    if (timeLeft < 0) {
        return null; // Hide expired products
    }

    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    const isTimeCritical = hoursLeft < 1 && daysLeft === 0; // Mark as critical if < 1 hour left

    return (
        <div className="p-4 shadow-lg rounded-md w-64">
            <div className="flex justify-center">
                <img
                    src={image || '/fallback-image.jpg'} // Fallback image if null
                    alt={itemName}
                    className="w-full h-40 object-cover rounded-md"
                />
            </div>
            <button
                className="mt-2 text-lg font-semibold cursor-pointer text-left"
                onClick={() => router.push(`/productpage/${bidItemID}`)}
                onKeyDown={(e) => e.key === 'Enter' && router.push(`/productpage/${bidItemID}`)}
                aria-label={`View details for ${itemName}`}
            >
                {itemName}
            </button>
            <div className="text-sm text-gray-500">{category}</div>
            <div className="text-xl font-bold mt-2 text-red-500">${currentPrice}</div>
            <div className={`mt-2 text-sm ${isTimeCritical ? 'text-red-600' : 'text-green-600'}`}>
                {daysLeft > 0 
                    ? `${daysLeft}d ${hoursLeft}h ${minutesLeft}m left`
                    : `${hoursLeft}h ${minutesLeft}m left`}
            </div>
        </div>
    );
};

export default Card;
