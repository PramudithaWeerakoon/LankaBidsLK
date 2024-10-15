import { z } from 'zod';
import { fetchCurrentPrice, fetchMinIncrement } from '@/actions/bidding';
import { Decimal } from '@prisma/client/runtime/library';

// Validation schema for placing a bid
export const BidSchema = z.object({
    BidItemID: z.number().int().positive("BidItemID must be a positive integer."),
    UserID: z.number().int().positive("UserID must be a positive integer."),
    BidAmount: z.number()
        .min(1, "Bid amount must be at least $1.")
});

// Function to validate the bid amount
export const validateBidAmount = async (BidItemID: number, bidAmount: number) => {
    const currentPrice = await fetchCurrentPrice(BidItemID);
    const minIncrement = await fetchMinIncrement(BidItemID);
    if (currentPrice === null) {
        throw new Error("Current price is not available.");
    }
    const minimumBid = currentPrice.add(minIncrement);

    if (new Decimal(bidAmount).lessThan(minimumBid)) {
        throw new Error(`Bid must be at least $${minimumBid.toFixed(2)}`);
    }
};

// Validation function for ensuring user is logged in
export const validateUserLoggedIn = (userID: string | null) => {
    if (!userID) {
        throw new Error("Please log in to place a bid.");
    }
};
