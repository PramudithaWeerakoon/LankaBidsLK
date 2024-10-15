"use client";

import React, { useEffect, useState } from 'react';
import { fetchUserBids } from '@/actions/mybids';

interface Bid {
    BidID: number;
    ItemName: string;
    StartingPrice: number;
    CurrentPrice: number;
    BidAmount: number;
}

const MyBids: React.FC = () => {
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBids = async () => {
        try {
            const userID = 1; // Replace this with actual user ID source
            const userBids = await fetchUserBids(userID);
            setBids(userBids);
        } catch (error) {
            console.error('Failed to fetch user bids:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bidID: number) => {
        try {
            await deleteUserBid(bidID);
            setBids((prevBids) => prevBids.filter((bid) => bid.BidID !== bidID));
        } catch (error) {
            console.error('Failed to delete bid:', error);
        }
    };

    useEffect(() => {
        fetchBids();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-4">My Bids</h1>
            {bids.length === 0 ? (
                <p>No bids found.</p>
            ) : (
                <table className="min-w-full bg-white border border-gray-300 rounded-md">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b">Item Name</th>
                            <th className="py-2 px-4 border-b">Starting Price</th>
                            <th className="py-2 px-4 border-b">Current Price</th>
                            <th className="py-2 px-4 border-b">Your Bid</th>
                            <th className="py-2 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bids.map((bid) => (
                            <tr key={bid.BidID}>
                                <td className="py-2 px-4 border-b">{bid.ItemName}</td>
                                <td className="py-2 px-4 border-b">${bid.StartingPrice.toFixed(2)}</td>
                                <td className="py-2 px-4 border-b">${bid.CurrentPrice.toFixed(2)}</td>
                                <td className="py-2 px-4 border-b">${bid.BidAmount.toFixed(2)}</td>
                                <td className="py-2 px-4 border-b">
                                    <button
                                        className="text-red-500 hover:text-red-700 font-semibold"
                                        onClick={() => handleDelete(bid.BidID)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyBids;
function deleteUserBid(bidID: number) {
    throw new Error('Function not implemented.');
}

