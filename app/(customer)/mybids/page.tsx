
import React from 'react';
import { getBidDetailsForCustomer } from '@/actions/mybids'; // Import the server action to fetch bids
import Card from '@/components/customer/mybids_card/mybidcard'; // Adjust this path if needed

const MyBids = async () => {
    // Fetch user's bids from server action
    const userBids = await getBidDetailsForCustomer();
    console.log('Fetched user bids:', userBids); // Log fetched bids for debugging

    // Filter for active bids only
    const activeBids = (userBids || []).filter(bid => {
        const currentTime = new Date().getTime();
        const bidEndTime = new Date(bid.BidEndTime).getTime();
        return bidEndTime > currentTime;
    });
    console.log('Active user bids:', activeBids); // Log active bids for debugging

    return (
        <div className="flex justify-center py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
                {activeBids.map((bid) => (
                    <Card
                        key={bid.BidID}
                        bidID={bid.BidID}
                        bidItemID={bid.BidItemID}
                        userID={bid.UserID}
                        image={`data:image/jpeg;base64,${bid.Image}`} // Convert image to base64 format
                        itemName={bid.ItemName}
                        itemDescription={bid.ItemDescription}
                        category={bid.category}
                        currentPrice={bid.CurrentPrice}
                        bidEndTime={bid.BidEndTime}
                        bidAmount={bid.BidAmount}
                        bidTime={bid.BidTime}
                        status={bid.Status}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyBids;
