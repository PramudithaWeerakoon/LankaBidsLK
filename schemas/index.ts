import * as z from "zod";

const sanitizeString = (str: string | undefined) => str ? str.replace(/['";]/g, '') : '';

enum UserRole {
  ADMIN = 'admin',
  BIDDER = 'bidder',
  SELLER = 'seller'
}

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
  role: z.string().refine((val) => Object.values(UserRole).includes(val as UserRole), {
    message: "Role must be one of Customer, or Seller",
  }).default(UserRole.BIDDER),
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