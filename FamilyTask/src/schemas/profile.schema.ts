import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be less than 30 characters"),

  email: z.string().min(1, "Email is required").email("Invalid email"),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
