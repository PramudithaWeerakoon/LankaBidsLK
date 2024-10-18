import React from 'react';

interface DashboardCardProps {
    bidItemID: string;
    itemName: string;
    itemDescription: string;
    category: string;
    currentPrice: number; // Ensure this is defined as a number
    bidEndTime: string;
    status: string;
    bidCount: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
    bidItemID,
    itemName,
    itemDescription,
    category,
    currentPrice,
    bidEndTime,
    status,
    bidCount,
}) => {
    // Determine card color based on the status
    const getCardColor = () => {
        switch (status) {
            case 'Open':
                return 'bg-blue-500'; // Blue for open
            case 'Closed':
                return 'bg-red-500'; // Red for closed
            case 'Completed':
                return 'bg-green-500'; // Green for completed
            default:
                return 'bg-gray-500'; // Default color
        }
    };

    // Ensure currentPrice is a number and fallback to 0 if invalid
    const price = typeof currentPrice === 'number' ? currentPrice : parseFloat(currentPrice) || 0;

    return (
        <div className={`p-4 rounded-lg shadow-md text-white ${getCardColor()}`}>
            <h3 className="text-lg font-bold">{itemName}</h3>
            <p>{itemDescription}</p>
            <p>Category: {category}</p>
            <p>Current Price: ${price.toFixed(2)}</p>
            <p>Bid End Time: {new Date(bidEndTime).toLocaleString()}</p>
            <p>Status: {status}</p>
            <p>Bid Count: {bidCount}</p>
        </div>
    );
};

export default DashboardCard;
