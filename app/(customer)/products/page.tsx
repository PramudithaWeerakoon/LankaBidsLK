// app/(customer)/products/page.tsx
import React from 'react';
import { getProductsForCustomer } from '@/actions/products'; // This remains a server action
import Card from '@/components/customer/card/card';

const Products = async () => { // Make this an async function to await server action
    const bidItems = await getProductsForCustomer(2); // Fetch bid items from the server action
    console.log('Fetched bid items:', bidItems); // Log fetched items

    const activeBidItems = bidItems.filter(item => {
        const currentTime = new Date().getTime();
        const bidEndTime = new Date(item.BidEndTime).getTime();
        return bidEndTime > currentTime; // Filter for active bids
    });
    console.log('Active bid items:', activeBidItems); // Log filtered items

    return (
        <div className="flex justify-center py-5">
            <div className="grid grid-cols-4 gap-8">
            {activeBidItems.map((item) => (
                <Card
                key={item.BidItemID}
                bidItemID={item.BidItemID}
                image={`data:image/jpeg;base64,${item.Image}`} // Ensure the image is displayed correctly
                itemName={item.ItemName}
                category={item.category}
                currentPrice={item.CurrentPrice}
                bidEndTime={item.BidEndTime}
                />
            ))}
            </div>
        </div>
    );
};

export default Products;