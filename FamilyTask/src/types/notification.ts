import { IProfile } from "./profile";
import { ITask } from "./task";

export enum NotificationType {
    TASK_ASSIGNED = "TASK_ASSIGNED",
    TASK_COMPLETED = "TASK_COMPLETED",
    FAMILY_INVITE = "FAMILY_INVITE",
    TASK_OVERDUE = "TASK_OVERDUE",
    FAMILY_MEMBER_JOINED = "FAMILY_MEMBER_JOINED",
    ROLE_CHANGED = "ROLE_CHANGED",
    TASK_COMPLETED_FOR_CREATOR = "TASK_COMPLETED_FOR_CREATOR",
    FAMILY_CREATED = "FAMILY_CREATED",
    FAMILY_WELCOME = "FAMILY_WELCOME"
  }
  
  export interface INotification {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    body: string;
    is_read: boolean;
    created_at: string;
    actor: IProfile;
    task: ITask;
  
    actor_id?: string | null;
    task_id?: string | null;
    family_id?: string | null;
  };