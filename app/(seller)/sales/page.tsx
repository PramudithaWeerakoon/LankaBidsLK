'use client';

import React, { useEffect, useState } from 'react';
import { getSalesDataForUser, updateDeliveryState } from '@/actions/sales';
import SalesCard from '@/components/seller/sales/SalesCard';

type BidItem = {
    BidItemID: number;
    ItemName: string;
    ItemDescription: string;
    category: string;
    CurrentPrice: number;
    BidEndTime: string;
    Status: string;
    deliver_states: number;
};

const SalesPage: React.FC = () => {
    const [items, setItems] = useState<BidItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const data = await getSalesDataForUser();
                if (data) {
                    const formattedData = data.map((item: BidItem) => ({
                        ...item,
                        CurrentPrice: typeof item.CurrentPrice === 'number' ? item.CurrentPrice : Number(item.CurrentPrice),
                    }));
                    setItems(formattedData);
                } else {
                    setError('No items found.');
                }
            } catch (err) {
                setError('Error fetching sales data.');
                console.error(err);
            }
        };

        fetchSalesData();
    }, []);

    const handleUpdateDeliveryState = async (id: string) => {
        try {
            const response = await updateDeliveryState(id);
            if (response) {
                setItems(prevItems =>
                    prevItems.map(item =>
                        item.BidItemID.toString() === id ? { ...item, deliver_states: 1 } : item
                    )
                );
            }
        } catch (error) {
            console.error('Failed to update delivery state:', error);
        }
    };

    return (
        <div className="flex justify-center py-5">
            <div className="w-full max-w-5xl">
                <h1 className="text-2xl font-bold mb-6">Your Sales</h1>
                {error && <p className="text-red-500">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {items.length === 0 ? (
                        <p>No sales found.</p>
                    ) : (
                        items.map((item: BidItem) => (
                            <SalesCard
                                key={item.BidItemID}
                                bidItemID={item.BidItemID.toString()}
                                itemName={item.ItemName}
                                itemDescription={item.ItemDescription}
                                category={item.category}
                                currentPrice={item.CurrentPrice}
                                bidEndTime={item.BidEndTime}
                                status={item.Status}
                                deliveryState={item.deliver_states}
                                onUpdateDeliveryState={handleUpdateDeliveryState}
                                onItemClick={() => { /* Add your onClick handler logic here */ }}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesPage;
