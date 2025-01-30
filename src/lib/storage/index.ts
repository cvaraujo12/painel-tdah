import { v4 as uuidv4 } from 'uuid';

interface StorageItem {
  id: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Task extends StorageItem {
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
}

interface Note extends StorageItem {
  content: string;
  taskId?: string;
}

interface MoodEntry extends StorageItem {
  mood: number;
  notes?: string;
  date: string;
}

type TableName = 'tasks' | 'notes' | 'mood_entries';

class LocalStorage {
  private getTableData<T>(table: TableName): T[] {
    const data = localStorage.getItem(table);
    return data ? JSON.parse(data) : [];
  }

  private setTableData<T>(table: TableName, data: T[]): void {
    localStorage.setItem(table, JSON.stringify(data));
  }

  async query<T extends StorageItem>(table: TableName, userId?: string): Promise<T[]> {
    const data = this.getTableData<T>(table);
    return userId ? data.filter(item => item.userId === userId) : data;
  }

  async insert<T extends StorageItem>(table: TableName, item: Partial<T>, userId?: string): Promise<T> {
    const data = this.getTableData<T>(table);
    const newItem = {
      ...item,
      id: uuidv4(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T;
    
    data.push(newItem);
    this.setTableData(table, data);
    return newItem;
  }

  async update<T extends StorageItem>(table: TableName, id: string, updates: Partial<T>): Promise<T | null> {
    const data = this.getTableData<T>(table);
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    const updatedItem = {
      ...data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    data[index] = updatedItem;
    this.setTableData(table, data);
    return updatedItem;
  }

  async delete(table: TableName, id: string): Promise<boolean> {
    const data = this.getTableData(table);
    const filteredData = data.filter(item => item.id !== id);
    this.setTableData(table, filteredData);
    return true;
  }
}

export const storage = new LocalStorage();

// Mock da autenticação
interface User {
  id: string;
  email: string;
  name?: string;
}

class AuthService {
  private readonly STORAGE_KEY = 'auth_user';

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  async signIn(email: string, password: string): Promise<User> {
    // Mock de autenticação simples
    const user = {
      id: uuidv4(),
      email,
      name: email.split('@')[0],
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async signUp(email: string, password: string): Promise<User> {
    return this.signIn(email, password);
  }
}

export const auth = new AuthService(); 