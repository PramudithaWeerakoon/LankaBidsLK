"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { deleteBid } from '@/actions/mybids'; // Import the deleteBid function

interface CardProps {
    // Remove onDelete from here
    bidID: number;
    bidItemID: number;
    userID: number;
    image: string | null;
    itemName: string;
    itemDescription: string;
    category: string;
    currentPrice: number;
    bidEndTime: string;
    bidAmount: number;
    bidTime: string;
    status: string;
}

const Card: React.FC<CardProps> = ({
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
    const router = useRouter();

    const calculateTimeLeft = () => {
        const endTime = new Date(bidEndTime).getTime();
        const now = new Date().getTime();
        return endTime - now;
    };

    const timeLeft = calculateTimeLeft();
    if (timeLeft < 0) return null; // Hide expired products

    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    const handleDelete = async (e: React.FormEvent) => {
        e.stopPropagation();
        try {
            const response = await deleteBid(bidID);
            if (response && response.success) {
                console.log('Bid deleted successfully.');
                // Optionally, you can implement state management to update the UI accordingly
            }
        } catch (error) {
            console.error('Failed to delete bid:', error);
        }
    };

    return (
        <div
            
            
        >
            <form className='flex p-4 shadow-lg rounded-md w-full cursor-pointer transition-transform transform hover:scale-105'
                onSubmit={handleDelete}
            >
                {/* Left side: Image */}
            <div className="flex-shrink-0 w-1/3">
                <img
                    src={image || '/fallback-image.jpg'}
                    alt={itemName}
                    className="w-full h-full object-cover rounded-md"
                />
            </div>
            {/* Right side: Details */}
            <div className="flex-grow ml-4">
                <div className="text-lg font-semibold">Item: {itemName}</div>
                <div className="text-sm text-gray-500">Category: {category}</div>
                <div className="text-sm text-gray-700">Description: {itemDescription}</div>
                <div className="text-sm text-gray-500">Bid ID: {bidID}</div>
                <div className="text-sm text-gray-500">User ID: {userID}</div>
                <div className="text-lg font-bold mt-2 text-red-500">Current Price: ${currentPrice}</div>
                <div className="text-sm text-gray-500">Your Bid: ${bidAmount}</div>
                <div className="text-xs text-gray-400">Bid Time: {new Date(bidTime).toLocaleString()}</div>
                <div className={`mt-1 text-sm ${status === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {status}
                </div>
                <div className="mt-2 text-sm text-green-600">
                    {daysLeft > 0 
                        ? `${daysLeft}d ${hoursLeft}h ${minutesLeft}m left`
                        : `${hoursLeft}h ${minutesLeft}m left`}
                </div>
                <button
                    className='mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-md'
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
            </form>
            
        </div>
    );
};

export default Card;

