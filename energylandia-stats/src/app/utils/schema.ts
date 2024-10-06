import { z } from "zod";

export const daySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
export const hourSchema = z.string().regex(/^\d{2}:\d{2}$/)
export const dayOfWeekSchema = z
  .string()
  .transform((val) => {
    const parsed = Number(val);
    if (isNaN(parsed)) {
      throw new Error("Invalid number");
    }
    return parsed;
  })
  .refine((val) => Number.isInteger(val) && val >= 0 && val <= 6, {
    message: "dayOfWeek must be an integer between 0 and 6",
  });

