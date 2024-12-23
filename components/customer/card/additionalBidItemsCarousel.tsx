import React, { useEffect, useState } from 'react';
import { getAdditionalBidItems } from '@/actions/bidding';
import Link from 'next/link';

interface AdditionalBidItemsCarouselProps {
    currentBidItemId: number;
}

interface BidItem {
    BidItemID: number;
    ItemName: string;
    CurrentPrice: number | null; // Allowing CurrentPrice to be null
    Image: string;
}

const AdditionalBidItemsCarousel: React.FC<AdditionalBidItemsCarouselProps> = ({ currentBidItemId }) => {
    const [additionalBidItems, setAdditionalBidItems] = useState<BidItem[]>([]);

    useEffect(() => {
        const fetchAdditionalItems = async () => {
            const items = await getAdditionalBidItems(currentBidItemId);
            setAdditionalBidItems(items);
        };

        fetchAdditionalItems();
    }, [currentBidItemId]);

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-center">More Items to Bid On</h3>
            <div className="flex overflow-x-auto space-x-4 p-4 bg-gray-100 rounded-lg">
                {additionalBidItems.map((item) => (
                    <Link href={`/productpage/${item.BidItemID}`} key={item.BidItemID} className="min-w-[150px] p-4 border rounded-md shadow-md bg-white text-center flex-shrink-0">
                        {item.Image && (
                            <img 
                                src={`data:image/jpeg;base64,${item.Image}`} 
                                alt={item.ItemName} 
                                className="w-full h-24 object-cover mb-2 rounded-md"
                            />
                        )}
                        <div className="font-semibold text-sm text-gray-800">{item.ItemName}</div>
                        <div className="text-gray-500 text-xs">
                            Current Price: ${item.CurrentPrice !== null ? item.CurrentPrice.toFixed(2) : 'N/A'}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdditionalBidItemsCarousel;
