import { z } from "zod";

export const createFamilySchema = z.object({
  name: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(30, "Maximum 30 characters"),
});

export type CreateFamilyForm = z.infer<typeof createFamilySchema>;