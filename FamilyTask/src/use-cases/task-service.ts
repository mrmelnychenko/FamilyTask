import { createNotification } from "@/src/services/notification-service";
import { NotificationType } from "@/src/types/notification";
import { CreateTaskParams } from "../types/task";
import { createTaskService } from "../services/task-service";

export async function createTaskUseCase(params: CreateTaskParams) {
  const task = await createTaskService(params);

  await createNotification({
    userId: params.assigneeId,
    type: NotificationType.TASK_ASSIGNED,
    title: "Нова задача",
    body: params.title,
  });

  return task;
}