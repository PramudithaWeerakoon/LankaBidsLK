// components/customer/card/BidHistory.tsx
import React from 'react';

interface BidHistoryProps {
    bidHistory: Array<{ BidAmount: number; createdAt: string }>;
}

const BidHistory: React.FC<BidHistoryProps> = ({ bidHistory }) => {
    return (
        <div className="w-full md:w-1/3 p-4 border-r flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2 text-center">Your Bid History</h2>
            <div className="text-sm text-gray-700 text-center mb-4">
                Total Bids: <span className="font-bold">{bidHistory.length}</span>
            </div>
            {bidHistory.length > 0 ? (
                <ul className="flex flex-col items-center space-y-4 w-full h-80 overflow-y-auto">
                    {bidHistory.map((bid, index) => (
                        <li 
                            key={index} 
                            className="w-[90%] max-w-xs p-4 border rounded-md shadow-md bg-gray-50 text-center flex flex-col items-center"
                        >
                            <div className="font-semibold text-lg text-gray-800">${bid.BidAmount.toFixed(2)}</div>
                            <div className="text-gray-500 text-sm mt-1">
                                Placed on {new Date(bid.createdAt).toLocaleDateString()}<br />
                                at {new Date(bid.createdAt).toLocaleTimeString()}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No bids placed yet.</p>
            )}
        </div>
    );
};

export default BidHistory;
