import React from 'react';

interface SummaryCardProps {
    totalBids: number;
    pendingBids: number;
    soldItems: number;
    totalProfit: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ totalBids, pendingBids, soldItems, totalProfit }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-8">
            <div className="p-5 border rounded shadow">
            <h3 className="text-xl">Total Bids</h3>
            <p className="text-3xl">{totalBids}</p>
            </div>
            <div className="p-5 border rounded shadow">
            <h3 className="text-xl">Pending Bids</h3>
            <p className="text-3xl">{pendingBids}</p>
            </div>
            <div className="p-5 border rounded shadow">
            <h3 className="text-xl">Sold Items</h3>
            <p className="text-3xl">{soldItems}</p>
            </div>
            <div className="p-5 border rounded shadow">
                <h3 className="text-xl">Total Profit</h3>
                <p className="text-xl">${totalProfit}</p>
            </div>
        </div>
    );
};

export default SummaryCard;
