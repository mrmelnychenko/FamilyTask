import { IProfile } from "./profile";

export interface ITask {
    id: string;
    title: string;
    description: string | null;
  
    family_id: string;
  
    assignee: IProfile | null;
    creator: IProfile | null;
  
    status: "PENDING" | "IN_PROGRESS" | "DONE";
  
    xp_reward: number;
  
    deadline: string | null;
  
    created_at: string;
  }

  export interface ITaskCompletion  {
    id: string;
    task_id: string;
    user_id: string;
    xp_earned: number;
    completed_at: string;
  };


  export interface ITaskRow {
    id: string;
  
    title: string;
    description: string | null;
  
    family_id: string;
  
    assigned_to: string | null;
    created_by: string | null;
  
    status: "PENDING" | "IN_PROGRESS" | "DONE";
  
    xp_reward: number;
  
    deadline: string | null;
  
    created_at: string;
  
    assignee: IProfile[] | null;
    creator: IProfile[] | null;
  }