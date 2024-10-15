// Import necessary modules
import Image from 'next/image';
import vehicleImage from '@/components/Home/bg.jpg'; 
import partnerLogo1 from '@/components/Home/samsung.png'; 
import partnerLogo2 from '@/components/Home/apple.png'; 
import partnerLogo3 from '@/components/Home/mi.png'; 
import partnerLogo4 from '@/components/Home/asus.png'; 
import Card from '@/components/customer/card/card'; // Import the Card component
import { getHotDealsForCustomer } from '@/actions/hotdeals'; // Import the server action to fetch products

const HomePage = async () => {
    // Fetch the products
    const bidItems = await getHotDealsForCustomer(); // Fetch products
    const activeBidItems = bidItems.filter(item => {
        const currentTime = new Date().getTime();
        const bidEndTime = new Date(item.BidEndTime).getTime();
        return bidEndTime > currentTime; // Filter active products
    });

    return (
      <div className="w-full">
        {/* Image Section */}
        <div className="relative w-full h-screen flex items-center justify-center bg-gray-900">
          {/* Background image */}
          <Image
            src={vehicleImage}
            alt="Vehicle background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0" // Adjusted to remove opacity, because we add an overlay
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-10 z-10"></div>

          {/* Text and Search bar */}
          <div className="relative z-20 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">
              Find the Best Products to Buy and Sell Near You
            </h1>
            <p className="text-lg mb-8">
              Search Products from trusted sellers near you.
            </p>

            {/* Search bar */}
            <div className="flex justify-center items-center">
              <input
                type="text"
                placeholder="Search product by name..."
                className="w-[300px]  p-2 text-gray-900 rounded-l-lg focus:outline-none text-sm"
              />
              <button className="px-4 py-2 bg-gradient-to-r text-sm from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 rounded-r-lg text-white transition duration-200">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Partner Logos Section */}
        <div className="py-12 bg-white">
        <h2 className="text-4xl font-bold text-neutral-600 text-center mb-8">Featured Products</h2>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Render each active bid item using the Card component */}
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
          {/* "We are partnered with" Section */}
          <h2 className="text-4xl font-bold text-neutral-600 text-center mb-6">We are partnered with</h2>

          {/* Partner cards */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-100 px-4 py-12 rounded-lg shadow-md flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
              <Image src={partnerLogo1} alt="Partner 1 Logo" width={100} height={100} className='size-max' />
            </div>
            <div className="bg-gray-100 px-4 py-12 rounded-lg shadow-md flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
              <Image src={partnerLogo2} alt="Partner 2 Logo" width={100} height={100} className='size-max' />
            </div>
            <div className="bg-gray-100 px-4 py-12 rounded-lg shadow-md flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
              <Image src={partnerLogo3} alt="Partner 3 Logo" width={100} height={100} className='size-max'/>
            </div>
            <div className="bg-gray-100 px-4 py-12 rounded-lg shadow-md flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
              <Image src={partnerLogo4} alt="Partner 4 Logo" width={100} height={100} className='size-max'/>
            </div>
          </div>
        </div>
      </div>
    );
};

export default HomePage;
