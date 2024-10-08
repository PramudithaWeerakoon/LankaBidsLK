"use client"; // Marks this file as a client component
import { useEffect, useState } from 'react';
import { getProductDetails, placeBid } from '@/actions/bidding';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ProductPageProps {
    readonly params: {
        readonly id: string;
    };
}

export default function ProductPage({ params }: ProductPageProps) {
    const productID = Number(params.id);
    const [product, setProduct] = useState<any>(null);
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>(''); // State for error message

    useEffect(() => {
        const fetchProductDetails = async () => {
            const productDetails = await getProductDetails(productID);
            console.log(productDetails[0].Image); // This should output a string like 'uploads/imagename.jpg'
            if (!productDetails || productDetails.length === 0) {
                notFound();
            } else {
                setProduct(productDetails[0]);
            }
        };
    
        fetchProductDetails();
    }, [productID]);

    const handleBidSubmit = async () => {
        const minimumBid = calculateMinimumBid();
        if (bidAmount < minimumBid) {
            setError(`Bid must be at least $${minimumBid.toFixed(2)}`); // Set error message
            return;
        } else {
            setError(''); // Clear error if valid bid
        }

        const userID = localStorage.getItem("userID"); // Retrieve userID from local storage

        if (!userID) {
            setError("Please log in to place a bid.");
            return;
        }
        const result = await placeBid(product.BidItemID, Number(userID), bidAmount);
        if (result.success) {
            setMessage(result.message);
            window.location.reload();
            setBidAmount(0); // Reset bid amount after successful bid
        } else {
            setMessage(result.message);
        }
    };

    const calculateTimeLeft = () => {
        const endTime = new Date(product.BidEndTime).getTime();
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
            return "Bid ended";
        }

        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

        return daysLeft > 0
            ? `${daysLeft}d ${hoursLeft}h ${minutesLeft}m left`
            : `${hoursLeft}h ${minutesLeft}m left`;
    };

    const calculateMinimumBid = () => {
        const currentPrice = parseFloat(product.CurrentPrice);
        const minIncrement = parseFloat(product.MinIncrement);
        const minimumBid = currentPrice + minIncrement;
        return parseFloat(minimumBid.toFixed(2)); // Convert back to number
    };

    if (!product) return <div>Loading...</div>; // Loading state while fetching product

    return (
        <div className="flex flex-col md:flex-row p-4 max-w-4xl mx-auto border rounded-lg mt-14 mb-14">
            {/* Left Side: Image and Description */}
            <div className="flex-1 mr-10">
                {/* Product Image */}
                <div className="flex justify-center mb-4">
                    <Image
                        src={`data:image/jpeg;base64,${product.Image}`}
                        alt={product.ItemName}
                        className="object-cover rounded-md"
                        width={300}
                        height={300}
                    />
                </div>

                {/* Description */}
                <div className="border-t pt-4">
                    <h2 className="text-xl font-bold mb-2">Description</h2>
                    <p className="text-gray-700">{product.ItemDescription}</p>
                </div>
            </div>

            {/* Right Side: Product Details */}
            <div className="flex-1">
                {/* Product Name */}
                <h1 className="text-3xl font-bold mb-2">{product.ItemName}</h1>

                {/* Time Left */}
                <div className="text-sm text-gray-500 mb-8">
                    Closes: <span className="font-semibold">{calculateTimeLeft()}</span>
                </div>

                {/* Current Price */}
                <div className="text-2xl font-bold text-black mb-8">
                    ${product.CurrentPrice} <span className="text-sm font-normal text-gray-500">(Current Bid)</span>
                </div>

                {/* Minimum Increment */}
                <div className="text-sm text-gray-700 mb-4">
                    Minimum Bid: ${calculateMinimumBid()}
                </div>

                {/* Bid Input and Button */}
                <div className="flex items-center mb-4">
                    <input
                        type="number"
                        className="border p-2 rounded w-40 mr-2"
                        placeholder={`Bid ${calculateMinimumBid()} or more`}
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                    />
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                        onClick={handleBidSubmit}
                    >
                        Place Bid
                    </button>
                </div>
                {error && <div className="text-red-500">{error}</div>} {/* Display error message */}
                {message && <div className="text-red-500">{message}</div>}
            </div>
        </div>
    );
}
