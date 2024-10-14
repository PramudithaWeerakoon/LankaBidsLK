"use client";

import React, { useEffect, useState } from 'react';
import { getUserBids } from '@/actions/bidding'; 
import { parseCookies } from 'nookies';

interface Bid {
    BidItemID: number; // Ensure this is always a number
    ItemName: string;
    StartingPrice: number;
    YourBid: number;
}

const MyBids: React.FC = () => {
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const cookies = parseCookies();
                const userID = parseInt(cookies.userID, 10); // Convert string to number
                if (isNaN(userID)) {
                    throw new Error('Invalid user ID');
                }
                console.log('Fetching bids for userID:', userID); // Debug log
                const userBids = await getUserBids(userID); // Fetch the user's bids
                console.log('Fetched bids:', userBids); // Debug log

                // Ensure the fetched bids match the Bid interface
                const validBids = userBids.map((bid: any) => ({
                    BidItemID: Number(bid.BidItemID),
                    ItemName: bid.ItemName,
                    StartingPrice: Number(bid.StartingPrice),
                    YourBid: Number(bid.YourBid),
                }));

                setBids(validBids);
            } catch (error) {
                console.error('Failed to fetch user bids:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBids();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>My Bids</h1>
            <table>
                <thead>
                    <tr>
                        <th>Bid Name</th>
                        <th>Starting Price</th>
                        <th>Your Bid</th>
                    </tr>
                </thead>
                <tbody>
                    {bids.map((bid) => (
                        <tr key={bid.BidItemID}>
                            <td>{bid.ItemName}</td>
                            <td>${bid.StartingPrice}</td>
                            <td>${bid.YourBid}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyBids;