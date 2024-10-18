// app/page.tsx

import Image from 'next/image';
import partnerLogo1 from '@/components/Home/samsung.png';
import partnerLogo2 from '@/components/Home/apple.png';
import partnerLogo3 from '@/components/Home/mi.png';
import partnerLogo4 from '@/components/Home/asus.png';
import Card from '@/components/customer/card/card';
import { getHotDealsForCustomer } from '@/actions/hotdeals';
import { searchProducts } from '@/actions/searchActions'; 

interface HomePageProps {
    searchParams: { query?: string };
}

const HomePage = async ({ searchParams }: HomePageProps) => {
    const searchQuery = searchParams?.query || '';
    
    // Fetch search results if a query is provided, otherwise fetch hot deals
    const searchResults = searchQuery ? await searchProducts(searchQuery) : [];
    const hotDeals = await getHotDealsForCustomer();

    return (
        <div className="w-full">
            <div className="relative w-full h-[80vh] flex items-center justify-center bg-gray-900"> {/* Reduced height */}
        {/* Background video */}
        <video 
            autoPlay 
            loop 
            muted 
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            playsInline
        >
            <source src="/video1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>

        {/* Overlay and Content */}
        <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
        <div className="relative z-20 text-center">
            <h1 className="text-4xl font-bold mb-4 text-white">
                Find the Best Products to Buy and Sell Near You
            </h1>
            <p className="text-lg mb-8 text-white">
                Search Products from trusted sellers near you.
            </p>
            <form action="/" method="GET" className="flex justify-center items-center">
                <input
                    type="text"
                    name="query"
                    placeholder="Search product by name..."
                    defaultValue={searchQuery}
                    className="w-[300px] p-2 text-gray-900 rounded-l-lg focus:outline-none text-sm"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r text-sm from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 rounded-r-lg text-white transition duration-200"
                >
                    Search
                </button>
            </form>
        </div>
    </div>

            <div className="py-12 bg-white">
                {/* Display search results if there is a search query */}
                {searchQuery ? (
                    searchResults.length > 0 ? (
                        <div>
                            <h2 className="text-4xl font-bold text-neutral-600 text-center mb-8">
                                Search Results
                            </h2>
                            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                                {searchResults.map((item) => (
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
                    ) : (
                        <div className="text-gray-500 text-lg mt-4 text-center">
                            No products found matching your criteria.
                        </div>
                    )
                ) : null}

                {/* Hot Deals Section */}
                <h2 className="text-4xl font-bold text-neutral-600 text-center mb-8 flex items-center justify-center animate-pulse">
                    Hot Deals <span className="ml-2 text-red-500">🔥</span>
                </h2>
                {hotDeals.length > 0 ? (
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {hotDeals.map((item) => (
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
                ) : (
                    <div className="text-gray-500 text-lg mt-4 text-center">
                        No hot deals available at the moment.
                    </div>
                )}

                {/* Partner Logos Section */}
                <h2 className="text-4xl font-bold text-neutral-600 text-center mb-6">We are partnered with</h2>
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[partnerLogo1, partnerLogo2, partnerLogo3, partnerLogo4].map((logo, index) => (
                        <div key={index} className="bg-gray-100 px-4 py-12 rounded-lg shadow-md flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
                            <Image src={logo} alt={`Partner ${index + 1} Logo`} width={100} height={100} className="size-max" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
