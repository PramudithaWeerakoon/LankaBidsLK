// components/customer/card/AdditionalBidItemsCarousel.tsx
import React, { useEffect, useState } from 'react';
import { getAdditionalBidItems } from '@/actions/bidding';

interface AdditionalBidItemsCarouselProps {
    currentBidItemId: number;
}

const AdditionalBidItemsCarousel: React.FC<AdditionalBidItemsCarouselProps> = ({ currentBidItemId }) => {
    const [additionalBidItems, setAdditionalBidItems] = useState<Array<{ BidItemID: number; ItemName: string; CurrentPrice: number; Image: string }>>([]);

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
                    <div 
                        key={item.BidItemID} 
                        className="min-w-[150px] p-4 border rounded-md shadow-md bg-white text-center flex-shrink-0"
                    >
                        {item.Image && (
                            <img 
                                src={`data:image/jpeg;base64,${item.Image}`} 
                                alt={item.ItemName} 
                                className="w-full h-24 object-cover mb-2 rounded-md"
                            />
                        )}
                        <div className="font-semibold text-sm text-gray-800">{item.ItemName}</div>
                        <div className="text-gray-500 text-xs">
                            Current Price: ${item.CurrentPrice ? item.CurrentPrice.toFixed(2) : 'N/A'}
                        </div>
                                            </div>
                ))}
            </div>
        </div>
    );
};

export default AdditionalBidItemsCarousel;
