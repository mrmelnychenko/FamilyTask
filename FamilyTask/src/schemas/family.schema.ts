import { z } from "zod";

export const createFamilySchema = z.object({
  name: z
    .string()
    .min(3, "Minimum 3 characters")
    .max(30, "Maximum 30 characters"),
});


export const joinFamilySchema = z.object({
    code: z
      .string()
      .min(1, 'Enter invite code')
      .length(8, 'Code must be exactly 8 characters'),
  });
  

export type JoinFamilyForm = z.infer<typeof joinFamilySchema>;
export type CreateFamilyForm = z.infer<typeof createFamilySchema>;