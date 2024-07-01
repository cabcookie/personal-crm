import { z } from "zod";

export const revenueNumber = z
  .number()
  .nonnegative("Provide a positive number")
  .lte(1000000000, "Can't be more than $1B");
