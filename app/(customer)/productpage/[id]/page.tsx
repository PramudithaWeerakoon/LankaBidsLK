"use client";
import { useEffect, useState } from 'react';
import {
    getSingleBidItem,
    submitNewPaymentAndPlaceBid,
    updatePaymentAndPlaceBid,
    checkExistingPaymentAndBid,
    getUserBidHistory,
    countUniqueBidders
} from '@/actions/bidding';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import BidHistory from "@/components/customer/card/bidHistory";
import AdditionalBidItemsCarousel from "@/components/customer/card/additionalBidItemsCarousel";
import PaymentFormModal from "@/components/customer/payment/form";
import Confirm from "@/components/customer/payment/confirm";

interface ProductPageProps {
    readonly params: { readonly id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
    const productID = Number(params.id);
    const [product, setProduct] = useState<any>(null);
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [bidHistory, setBidHistory] = useState<Array<{ BidAmount: number; createdAt: string }>>([]);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [uniqueBiddersCount, setUniqueBiddersCount] = useState<number>(0);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false); // Confirm modal state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productDetails = await getSingleBidItem(productID);
                const userBidHistory = await getUserBidHistory(productID);
                const uniqueCount = await countUniqueBidders(productID);

                if (!productDetails) {
                    notFound();
                } else {
                    setProduct(productDetails);
                    setBidHistory(Array.isArray(userBidHistory) ? userBidHistory : []);
                    setUniqueBiddersCount(uniqueCount || 0);
                    updateTimeLeft(productDetails.BidEndTime);
                }
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };

        fetchData();
    }, [productID]);

    useEffect(() => {
        const timer = setInterval(() => {
            if (product?.BidEndTime) {
                updateTimeLeft(product.BidEndTime);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [product]);

    const updateTimeLeft = (endTimeString: string) => {
        const endTime = new Date(endTimeString).getTime();
        const now = new Date().getTime();
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
            setTimeLeft("Bid ended");
            return;
        }

        const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

        setTimeLeft(
            daysLeft > 0
                ? `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s left`
                : `${hoursLeft}h ${minutesLeft}m ${secondsLeft}s left`
        );
    };

    const calculateMinimumBid = () => {
        const currentPrice = parseFloat(product.CurrentPrice) || 0;
        const minIncrement = parseFloat(product.MinIncrement) || 0;
        return parseFloat((currentPrice + minIncrement).toFixed(2));
    };

    const handleBidSubmit = async () => {
        const minimumBid = calculateMinimumBid();
        if (bidAmount < minimumBid) {
            setError(`Bid must be at least $${minimumBid.toFixed(2)}`);
            return;
        }
        setError('');

        try {
            const existingPaymentResult = await checkExistingPaymentAndBid(productID);

            if (existingPaymentResult.exists) {
                setIsConfirmOpen(true); // Open Confirm modal
            } else {
                setPaymentModalOpen(true); // Open Payment form
            }
        } catch (error) {
            console.error("Error checking existing payment:", error);
            setError("An error occurred while checking payment status.");
        }
    };

    const handleConfirmContinue = async () => {
        setIsConfirmOpen(false); // Close Confirm modal

        const updateResult = await updatePaymentAndPlaceBid(productID, bidAmount);
        if (updateResult?.success) {
            setMessage(updateResult.message);
            setBidAmount(0);
            setProduct((prevProduct: any) => ({
                ...prevProduct,
                CurrentPrice: bidAmount,
            }));
            const userBidHistory = await getUserBidHistory(productID);
            setBidHistory(Array.isArray(userBidHistory) ? userBidHistory : []);
        } else {
            setError(updateResult?.message || 'Failed to update payment and place bid');
        }
    };

    const handlePaymentSubmit = async (cardDetails: {
        cardHolderName: string;
        cardNo: string;
        cvv: string;
        billingAddress: string;
    }) => {
        try {
            const result = await submitNewPaymentAndPlaceBid(
                product.BidItemID,
                bidAmount,
                cardDetails.cardHolderName,
                cardDetails.cardNo,
                cardDetails.cvv,
                cardDetails.billingAddress
            );

            if (result?.success) {
                setMessage(result.message);
                setBidAmount(0);
                setProduct((prevProduct: any) => ({
                    ...prevProduct,
                    CurrentPrice: bidAmount,
                }));
                const userBidHistory = await getUserBidHistory(productID);
                setBidHistory(Array.isArray(userBidHistory) ? userBidHistory : []);
            } else {
                setError(result?.message || 'Failed to process payment');
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            setError("An error occurred while processing the payment.");
        } finally {
            setPaymentModalOpen(false);
        }
    };

    if (!product) return <div>Loading...</div>;

    return (
        <section className="flex flex-col items-center justify-center min-h-screen py-8">
            <div className="flex flex-col md:flex-row p-6 w-full max-w-5xl mx-auto border rounded-lg mt-10 mb-10 space-y-8 md:space-y-0 md:space-x-8">
                <div className="flex-1 md:w-2/3">
                    <div className="flex flex-col items-center mb-6">
                        <Image
                            src={`data:image/jpeg;base64,${product.Image}`}
                            alt={product.ItemName}
                            className="object-cover rounded-md"
                            width={300}
                            height={300}
                        />
                        <h1 className="text-3xl font-bold mt-4 mb-2 text-center">{product.ItemName}</h1>
                    </div>
                    <div className="text-sm text-gray-500 mb-4 text-center">
                        Closes: <span className="font-semibold">{timeLeft}</span>
                    </div>
                    <div className="flex flex-col items-center mb-4">
                        <input
                            type="number"
                            className="border p-2 rounded w-40 mb-4"
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
                        {error && <div className="text-red-500 mt-2">{error}</div>}
                        {message && <div className="text-green-500 mt-2">{message}</div>}
                    </div>

                    {/* Display Current Price and Minimum Increment */}
                    <div className="text-lg font-semibold text-center">
                        <p>Current Price: <span className="text-red-500">${parseFloat(product.CurrentPrice).toFixed(2)}</span></p>
                        <p>Minimum Increment: <span className="text-red-500">${parseFloat(product.MinIncrement).toFixed(2)}</span></p>
                    </div>
                </div>

                <BidHistory bidHistory={bidHistory} />
            </div>

            <AdditionalBidItemsCarousel currentBidItemId={productID} />

            {isConfirmOpen && (
                <Confirm
                    onConfirm={handleConfirmContinue}
                    onCancel={() => setPaymentModalOpen(true)}
                    onClose={() => setIsConfirmOpen(false)}
                />
            )}

            {isPaymentModalOpen && (
                <PaymentFormModal
                    onSubmit={handlePaymentSubmit}
                    onClose={() => setPaymentModalOpen(false)}
                />
            )}
        </section>
    );
}
