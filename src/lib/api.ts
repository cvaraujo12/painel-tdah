import { Task } from '@/types/Task'

const API_BASE = '/api'

export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE}/tasks`)
  if (!response.ok) {
    throw new Error('Erro ao buscar tarefas')
  }
  return response.json()
}

export async function createTask(task: Omit<Task, 'id'>): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })
  if (!response.ok) {
    throw new Error('Erro ao criar tarefa')
  }
  return response.json()
}

export async function updateTask(
  id: string,
  task: Partial<Task>
): Promise<Task> {
  const response = await fetch(`${API_BASE}/tasks`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, ...task }),
  })
  if (!response.ok) {
    throw new Error('Erro ao atualizar tarefa')
  }
  return response.json()
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/tasks?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) {
    throw new Error('Erro ao deletar tarefa')
  }
} 