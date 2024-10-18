'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getBidsForItem } from '@/actions/bids';

type Bid = {
    BidID: number;
    BidAmount: number | string;
    BidTime: Date;
    Status: string;
    Username: string | null;  // Username can be null for non-accepted bids
    BillingAddress: string | null;  // BillingAddress can be null for non-accepted bids
};

const BidDetailsPage: React.FC = () => {
    const { id } = useParams();
    const [bids, setBids] = useState<Bid[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const data = await getBidsForItem(Number(id));
                setBids(data);
            } catch (err) {
                setError('Failed to fetch bids.');
                console.error(err);
            }
        };

        if (id) {
            fetchBids();
        }
    }, [id]);

    return (
        <div className="flex justify-center py-5">
            <div className="w-full max-w-5xl">
                <h1 className="text-2xl font-bold mb-6">Bids for Item ID: {id}</h1>
                {error && <p className="text-red-500">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bids.length === 0 ? (
                        <p>No bids found for this item.</p>
                    ) : (
                        bids.map((bid: Bid) => (
                            <div
                                key={bid.BidID}
                                className={`border p-4 rounded shadow ${
                                    bid.Status === 'Accepted' ? 'bg-green-100' : ''
                                }`}
                            >
                                <p>Bid Amount: ${
                                    typeof bid.BidAmount === 'number'
                                        ? bid.BidAmount.toFixed(2)
                                        : Number(bid.BidAmount).toFixed(2)
                                }</p>
                                <p>Bid Time: {new Date(bid.BidTime).toLocaleString()}</p>
                                <p>Status: {bid.Status}</p>
                                
                                {bid.Status === 'Accepted' && (
                                    <>
                                        <p>Name: {bid.Username}</p>
                                        <p>Billing Address: {bid.BillingAddress}</p>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BidDetailsPage;
