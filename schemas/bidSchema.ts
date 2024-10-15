// bidSchema.ts
import { z } from 'zod';

export const bidSchema = z.object({
    BidItemID: z.number().int().positive().min(1, "BidItemID must be a positive integer"),
    UserID: z.number().int().positive().min(1, "UserID must be a positive integer"),
    BidAmount: z.number().positive().min(1, "Bid amount must be at least 1"),
    CurrentPrice: z.number().optional(), // Allows current price validation on server-side
    MinIncrement: z.number().positive().optional(), // Min increment validation if required
    BidEndTime: z.date().optional() // Optional date validation
});

// Additional helper function for custom validations
export const validateBidAmount = (BidAmount: number, CurrentPrice: number, MinIncrement: number) => {
    const minimumBid = CurrentPrice + MinIncrement;
    if (BidAmount < minimumBid) {
        throw new Error(`Bid must be at least $${minimumBid.toFixed(2)}`);
    }
};

export const validateBidTime = (BidEndTime: Date) => {
    const now = new Date();
    if (BidEndTime && BidEndTime <= now) {
        throw new Error("Bidding period has ended.");
    }
};
