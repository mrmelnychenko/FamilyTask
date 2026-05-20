import { IProfile } from "./profile";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";
export type TaskRecurrence = "daily" | "weekly" | "monthly";
export type TaskCategory = "cleaning" | "cooking" | "shopping" | "education" | "health" | "finance" | "other";
export type TaskPriority = "low" | "normal" | "high";

export interface ITaskCompletion {
  id: string;
  task_id: string | null;
  user_id: string;
  xp_earned: number;
  completed_at: string;
  recurring_date: string | null;
}

export interface ITask {
  id: string;
  title: string;
  description: string | null;
  family_id: string;
  assignee: IProfile | null;
  creator: IProfile | null;
  assigned_to: string | null;
  created_by: string | null;
  status: TaskStatus;
  xp_reward: number;
  deadline: string | null;
  priority: TaskPriority;
  category: TaskCategory;
  created_at: string;
  is_recurring: boolean;
  recurrence: TaskRecurrence | null;
  recurrence_days: number[] | null;
  recurrence_end_date: string | null;
  completions?: ITaskCompletion[];
}

export type CreateTaskParams = {
  familyId: string;
  creatorId: string;
  assigneeId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
  priority: TaskPriority;
  category: TaskCategory;
  is_recurring: boolean;
  recurrence?: TaskRecurrence | null;
  recurrence_days?: number[] | null;
  recurrence_end_date?: string | null;
};

  export interface ISegmentTabs {
    key: string;
    label: string;
  };
  


  export interface ITaskFilters {
    recurrence: TaskRecurrence | null;
    priority: TaskPriority | null;
    categories: TaskCategory[];
  }
  