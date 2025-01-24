export type Priority = 'baixa' | 'média' | 'alta';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  due_date: string | null;
  tags: string[];
  category: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type TaskInput = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type TaskUpdate = Partial<TaskInput>;

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  byPriority: Record<Priority, number>;
  byCategory: Record<string, number>;
  byTag: Record<string, number>;
} 