export enum NotificationType {
    TASK_ASSIGNED = "TASK_ASSIGNED",
    TASK_COMPLETED = "TASK_COMPLETED",
    FAMILY_INVITE = "FAMILY_INVITE",
    TASK_OVERDUE = "TASK_OVERDUE",
  }
  
  export type Notification = {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    body: string;
    is_read: boolean;
    created_at: string;
  };