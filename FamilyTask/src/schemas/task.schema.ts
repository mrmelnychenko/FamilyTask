import { z } from "zod";

export const taskPriorities = ["low", "medium", "high"] as const;

export const taskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Введіть назву задачі")
      .max(80, "Назва занадто довга"),
    description: z.string().trim().max(300, "Опис занадто довгий").optional(),
    emoji: z.string().min(1),
    dueDate: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), {
        message: "Дата має бути у форматі РРРР-ММ-ДД",
      }),
    dueTime: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || /^([01]\d|2[0-3]):[0-5]\d$/.test(value), {
        message: "Час має бути у форматі ГГ:ХХ",
      }),
    priority: z.enum(taskPriorities),
    assigneeId: z.string().min(1, "Оберіть виконавця"),
  })
  .refine((data) => !data.dueTime || !!data.dueDate, {
    message: "Спочатку вкажіть дату",
    path: ["dueDate"],
  });

export type TaskFormData = z.infer<typeof taskSchema>;
export type TaskPriority = TaskFormData["priority"];
