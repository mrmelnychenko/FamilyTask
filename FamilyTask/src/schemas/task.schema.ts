import { z } from "zod";


export const taskSchema = z.object({
  title: z.string().min(1, "Введіть назву задачі"),
  description: z.string().optional(),
  assigneeId: z.string().min(1, "Оберіть виконавця"),
  dueDate: z.string().optional(),
  dueTime: z.string().optional(),
  is_recurring: z.boolean(),
  priority: z.enum(["low", "normal", "high"]),
  category: z.enum(["cleaning", "cooking", "shopping", "education", "health", "finance", "other"]),
  recurrence: z.enum(["daily", "weekly", "monthly"]).nullable(),
  recurrence_days: z.array(z.number()),
}).refine((data) => {
  if (!data.is_recurring && !data.dueDate) return false;
  return true;
}, { message: "Вкажіть дату або увімкніть повторення", path: ["dueDate"] });
export type TaskFormData = z.infer<typeof taskSchema>;
