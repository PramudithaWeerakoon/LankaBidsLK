// utils/convertToPlainObject.ts
import { Prisma } from "@prisma/client"; // Import from "@prisma/client" directly

// Helper function to convert Prisma data to plain JavaScript objects
export function convertToPlainObject(data: any) {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (value instanceof Prisma.Decimal) {
        return value.toNumber(); // or value.toString() if you need a string
      }
      if (value instanceof Uint8Array) {
        return Buffer.from(value).toString("base64");
      }
      return value;
    })
  );
}
