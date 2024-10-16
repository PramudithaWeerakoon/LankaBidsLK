// app/(customer)/mybids/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { getBidDetailsForCustomer } from '@/actions/mybids';
import Card from '@/components/customer/mybids_card/mybidcard';

const MyBids = () => {
    interface Bid {
        BidID: number;
        BidItemID: number;
        UserID: number;
        ItemName: string;
        ItemDescription: string;
        Image: string | null;
        category: string;
        CurrentPrice: number;
        BidEndTime: string;
        BidAmount: number;
        BidTime: string;
        Status: string;
    }

    const [activeBids, setActiveBids] = useState<Bid[]>([]);

    useEffect(() => {
        const fetchBids = async () => {
            const userBids = await getBidDetailsForCustomer();
            const currentTime = new Date().getTime();
            const activeBids = (userBids || []).filter(bid => new Date(bid.BidEndTime).getTime() > currentTime);
            setActiveBids(activeBids);
        };

        fetchBids();
    }, []);

    const handleDelete = (bidID: string) => {
        setActiveBids((prevBids) => prevBids.filter((bid) => bid.BidID !== Number(bidID)));
    };

    return (
        <div className="flex justify-center py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
                {activeBids.map((bid) => (
                    <Card
                        key={bid.BidID}
                        bidID={bid.BidID.toString()}
                        bidItemID={bid.BidItemID.toString()}
                        userID={bid.UserID.toString()}
                        image={`data:image/jpeg;base64,${bid.Image}`}
                        itemName={bid.ItemName}
                        itemDescription={bid.ItemDescription}
                        category={bid.category}
                        currentPrice={bid.CurrentPrice}
                        bidEndTime={bid.BidEndTime}
                        bidAmount={bid.BidAmount}
                        bidTime={bid.BidTime}
                        status={bid.Status}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyBids;
