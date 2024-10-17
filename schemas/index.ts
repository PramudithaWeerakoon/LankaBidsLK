import * as z from "zod";

const sanitizeString = (str: string | undefined) => str ? str.replace(/['";]/g, '') : '';

export enum UserRole {
  ADMIN = '1',
  SELLER = '2',
  BIDDER = '3'
}

export const SettingsSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).max(50).transform(sanitizeString),
  email: z.string().min(1, { message: "Email is required" }).email().max(100).transform(sanitizeString),
  role: z.nativeEnum(UserRole),
  isTwoFactorEnabled: z.boolean().optional(),
});

export const SignInSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email" }).max(100, { message: "Email must be at most 100 characters long" }).transform(sanitizeString),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }).max(50, { message: "Password must be at most 50 characters long" }).transform(sanitizeString),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).max(50).transform(sanitizeString),
  email: z.string().min(1, { message: "Email is required" }).email().max(100).transform(sanitizeString),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .transform(sanitizeString),
  role: z.nativeEnum(UserRole).default(UserRole.BIDDER),
  isActive: z.optional(z.boolean()).default(true),
});

// Search products schema for filtering product results
export const SearchProductsSchema = z.object({
  ItemName: z.string()
    .optional()
    .transform((val) => sanitizeString(val))
    .refine((value) => value?.length <= 100, {
      message: "Search term must be at most 100 characters long",
    }),
  category: z.string()
    .optional()
    .transform((val) => sanitizeString(val))
    .refine((value) => value?.length <= 100, {
      message: "Category must be at most 100 characters long",
    }),
}).refine((data) => {
  if (!data.ItemName && !data.category) {
    return false;
  }
  return true;
}, {
  message: "At least one search criterion (ItemName or category) must be provided.",
});
// Define the schema with enhanced validation for bidding
// Schema for placing bids
export const bidSchema = z.object({
  BidItemID: z.number()
    .int()
    .positive("Bid Item ID must be a positive integer."),
  BidAmount: z.number()
    .min(0, "Bid amount must be positive."),
  MinIncrement: z.number()
    .min(0, "Minimum increment must be positive.")
});
export const productSchema = z.object({
  ItemName: z.string().min(1, "Item name is required"),
  ItemDescription: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  StartingPrice: z.number().min(0, "Starting price must be at least 0").nullable().refine((val) => val !== null, {
    message: "Starting price cannot be null",
  }),
  CurrentPrice: z.number().optional(),
  MinIncrement: z.number().min(1, "Minimum increment must be at least 1").nullable().refine((val) => val !== null, {
    message: "Minimum increment cannot be null or less than 1",
  }),
  BidEndTime: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Bid end time must be a valid date",
  }),
  Status: z.enum(["Open", "Closed"]).default("Open"),
  Image: z.string().min(1, "An image must be selected").optional(),
});

export const PaymentSchema = z.object({
  cardHolderName: z.string()
    .min(1, { message: "Cardholder Name is required" })
    .max(100, { message: "Cardholder Name must be at most 100 characters long" })
    .transform((val) => sanitizeString(val)),

  cardNo: z.string()
    .min(16, { message: "Card number must be at least 16 digits long" })
    .max(19, { message: "Card number must be at most 19 digits long" })
    .refine((val) => /^[0-9]+$/.test(val), { message: "Card number must contain only digits" }),

  cvv: z.string()
    .min(3, { message: "CVV must be at least 3 digits long" })
    .max(4, { message: "CVV must be at most 4 digits long" })
    .refine((val) => /^[0-9]+$/.test(val), { message: "CVV must contain only digits" }),

  billingAddress: z.string()
    .min(1, { message: "Billing Address is required" })
    .max(255, { message: "Billing Address must be at most 255 characters long" })
    .transform((val) => sanitizeString(val)),
});

// Type for inferred payment form data
export type PaymentFormInput = z.infer<typeof PaymentSchema>;

export type ProductInput = z.infer<typeof productSchema>;


/*import * as z from "zod";

// Helper function to sanitize strings
const sanitizeString = (str: string) => str.replace(/['";]/g, '');

// Define the UserRole enum manually since we are not using Prisma
enum UserRole {
  ADMIN = 'admin',
  BIDDER = 'bidder',
  SELLER = 'seller'
}

// User schema for validation
export const UserSchema = z.object({
  username: z.string().max(50).transform(sanitizeString),
  email: z.string().email().max(100).transform(sanitizeString),
  password: z.string().min(6).transform(sanitizeString),
  role: z.enum([UserRole.ADMIN, UserRole.BIDDER, UserRole.SELLER]),
  isActive: z.optional(z.boolean()),
  createdAt: z.optional(z.string().transform(sanitizeString)),
  lastLogin: z.optional(z.string().transform(sanitizeString)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required to set a new password!",
    path: ["password"]
  });

// Settings schema for validation
export const SettingsSchema = z.object({
  name: z.optional(z.string().transform(sanitizeString)),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.BIDDER, UserRole.SELLER]),
  email: z.optional(z.string().email().transform(sanitizeString)),
  password: z.optional(z.string().min(6).transform(sanitizeString)),
  newPassword: z.optional(z.string().min(6).transform(sanitizeString)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }

    return true;
  }, {
    message: "New password is required!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }

    return true;
  }, {
    message: "Password is required to set a new password!",
    path: ["password"]
  });*/