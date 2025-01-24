export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  priority: 'baixa' | 'média' | 'alta'
  due_date: string | null
  tags: string[]
  category: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface Note {
  id: number
  title: string
  content: string
  tags: string[]
  category: string
  created_at: string
  updated_at: string
  user_id: string
}

export type Priority = 'baixa' | 'média' | 'alta';
export type GoalType = 'diária' | 'semanal' | 'mensal';
export type GoalStatus = 'pendente' | 'em_progresso' | 'concluída' | 'atrasada';

export interface Goal {
  id: number
  title: string
  description: string | null
  target_date: string
  progress: number
  type: GoalType
  status: GoalStatus
  priority: Priority
  tags: string[]
  created_at: string
  updated_at: string
  user_id: string
}

export interface SubTask {
  id: number
  goal_id: number
  title: string
  completed: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: Task
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Task, 'id'>>
      }
      notes: {
        Row: Note
        Insert: Omit<Note, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Note, 'id'>>
      }
      goals: {
        Row: Goal
        Insert: Omit<Goal, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Goal, 'id'>>
      }
      subtasks: {
        Row: SubTask
        Insert: Omit<SubTask, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SubTask, 'id'>>
      }
    }
  }
}

// Tipos para criação/atualização
export type TaskInput = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type TaskUpdate = Partial<TaskInput>;

export type GoalInput = Omit<Goal, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type GoalUpdate = Partial<GoalInput>;

export type SubTaskInput = Omit<SubTask, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type SubTaskUpdate = Partial<Omit<SubTask, 'id' | 'created_at' | 'updated_at'>>;

// Tipos de resposta da API
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
} 