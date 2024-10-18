// app/dashboard/page.tsx
'use client'; // This makes the component a client-side component

import React, { useState, useEffect } from 'react';
import { getDashboardDataForCustomer } from '@/actions/dashboard';
import DashboardCard from '@/components/seller/dashboard_card/dashboardcard';
import SummaryCard from '@/components/seller/dashboard_card/summarycard';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register the necessary chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [summary, setSummary] = useState({
        totalBids: 0,
        pendingBids: 0,
        soldItems: 0,
        totalProfit: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            const data = await getDashboardDataForCustomer();
            if (data) {
                setItems(data.items);
                setSummary(data.summary);
            }
        };

        fetchDashboardData();
    }, []);

    // Data for the charts
    const dates = items.map(item => new Date(item.BidEndTime).toLocaleDateString());
    const priceRanges = items.map(item => item.CurrentPrice);

    const bidPlacementData = {
        labels: dates,
        datasets: [
            {
                label: 'Bid Placement Dates',
                data: items.map(() => 1),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const priceRangeData = {
        labels: dates,
        datasets: [
            {
                label: 'Current Price',
                data: priceRanges,
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    const categories = items.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const categoryData = {
        labels: Object.keys(categories),
        datasets: [
            {
                label: 'Categories',
                data: Object.values(categories),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    return (
        <div className="flex justify-center py-5">
            <div className="w-full max-w-5xl">
                {/* Summary Card */}
                <SummaryCard 
                    totalBids={summary.totalBids}
                    pendingBids={summary.pendingBids}
                    soldItems={summary.soldItems}
                    totalProfit={summary.totalProfit}
                />

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                    {/* Bid Placement Dates Bar Chart */}
                    <div className="w-full h-64">
                        <h2 className="text-lg font-bold mb-4">Bid Placement Dates</h2>
                        <div className="h-full">
                            <Bar data={bidPlacementData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Current Price Ranges Bar Chart */}
                    <div className="w-full h-64">
                        <h2 className="text-lg font-bold mb-4">Current Price Ranges</h2>
                        <div className="h-full">
                            <Bar data={priceRangeData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>

                    {/* Bid Categories Pie Chart */}
                    <div className="w-full h-64">
                        <h2 className="text-lg font-bold mb-4">Bid Item Categories</h2>
                        <div className="h-full">
                            <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>

                {/* Dashboard Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
                    {items.map((item) => (
                        <DashboardCard
                            key={item.BidItemID}
                            bidItemID={item.BidItemID.toString()}
                            itemName={item.ItemName}
                            itemDescription={item.ItemDescription}
                            category={item.category}
                            currentPrice={item.CurrentPrice}
                            bidEndTime={item.BidEndTime}
                            status={item.Status}
                            bidCount={item.BidCount}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
