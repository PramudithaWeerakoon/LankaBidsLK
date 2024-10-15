// app/(customer)/products/page.tsx

import React from 'react';
import { getProductsForCustomer } from '@/actions/products';
import { searchProducts } from '@/actions/searchActions';
import Card from '@/components/customer/card/card';

interface ProductsProps {
    searchParams: { query?: string };
}

const Products = async ({ searchParams }: ProductsProps) => {
    const searchQuery = searchParams?.query || '';

    // Fetch products based on the search query
    const bidItems = searchQuery
        ? await searchProducts(searchQuery)
        : await getProductsForCustomer();

    // Filter active bid items based on bid end time
    const activeBidItems = bidItems.filter(item => {
        const currentTime = new Date().getTime();
        const bidEndTime = new Date(item.BidEndTime).getTime();
        return bidEndTime > currentTime;
    });

    return (
        <div className="flex flex-col items-center py-5">
            {/* Search Bar */}
            <div className="w-full max-w-3xl mb-6">
                <form action="/products" method="GET" className="flex justify-center items-center">
                    <input
                        type="text"
                        name="query"
                        placeholder="Search products by name..."
                        defaultValue={searchQuery}
                        className="w-[300px] p-2 text-gray-900 rounded-l-lg focus:outline-none text-sm"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 rounded-r-lg text-white text-sm transition duration-200"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Display Search Results or All Active Products */}
            {searchQuery && activeBidItems.length > 0 ? (
                <div className="w-full max-w-5xl mb-10">
                    <h2 className="text-3xl font-bold text-neutral-600 text-center mb-6">Search Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {activeBidItems.map((item) => (
                            <Card
                                key={item.BidItemID}
                                bidItemID={item.BidItemID}
                                image={`data:image/jpeg;base64,${item.Image}`}
                                itemName={item.ItemName}
                                category={item.category}
                                currentPrice={item.CurrentPrice}
                                bidEndTime={item.BidEndTime}
                            />
                        ))}
                    </div>
                </div>
            ) : activeBidItems.length === 0 && searchQuery ? (
                <div className="text-gray-500 text-lg mt-4">No products found matching your criteria.</div>
            ) : activeBidItems.length === 0 ? (
                <div className="text-gray-500 text-lg mt-4">No active products available at the moment.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {activeBidItems.map((item) => (
                        <Card
                            key={item.BidItemID}
                            bidItemID={item.BidItemID}
                            image={`data:image/jpeg;base64,${item.Image}`}
                            itemName={item.ItemName}
                            category={item.category}
                            currentPrice={item.CurrentPrice}
                            bidEndTime={item.BidEndTime}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Products;
