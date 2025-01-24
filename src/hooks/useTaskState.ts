import { useMemo } from 'react';
import { Task, Priority, TaskStats } from '@/types/Task';

export interface TaskFilters {
  searchTerm?: string;
  priority?: Priority;
  completed?: boolean;
  category?: string;
  tags?: string[];
  dueDateRange?: {
    start: Date;
    end: Date;
  };
}

export function useTaskState(tasks: Task[], filters: TaskFilters) {
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filtro por termo de busca
      if (filters.searchTerm && !task.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro por prioridade
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }

      // Filtro por status de conclusão
      if (typeof filters.completed === 'boolean' && task.completed !== filters.completed) {
        return false;
      }

      // Filtro por categoria
      if (filters.category && task.category !== filters.category) {
        return false;
      }

      // Filtro por tags
      if (filters.tags?.length && !filters.tags.some(tag => task.tags.includes(tag))) {
        return false;
      }

      // Filtro por intervalo de data
      if (filters.dueDateRange && task.due_date) {
        const dueDate = new Date(task.due_date);
        if (dueDate < filters.dueDateRange.start || dueDate > filters.dueDateRange.end) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, filters]);

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // Primeiro por prioridade
      const priorityOrder: Record<Priority, number> = { alta: 0, média: 1, baixa: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Depois por data de entrega
      if (a.due_date && b.due_date) {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }

      // Por fim, por data de criação
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [filteredTasks]);

  const taskStats = useMemo(() => {
    const now = new Date();
    
    const stats: TaskStats = {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      overdue: tasks.filter(t => !t.completed && t.due_date && new Date(t.due_date) < now).length,
      byPriority: {
        alta: tasks.filter(t => t.priority === 'alta').length,
        média: tasks.filter(t => t.priority === 'média').length,
        baixa: tasks.filter(t => t.priority === 'baixa').length
      },
      byCategory: {},
      byTag: {}
    };

    // Contagem por categoria
    tasks.forEach(task => {
      if (task.category) {
        stats.byCategory[task.category] = (stats.byCategory[task.category] || 0) + 1;
      }
    });

    // Contagem por tag
    tasks.forEach(task => {
      task.tags.forEach((tag: string) => {
        stats.byTag[tag] = (stats.byTag[tag] || 0) + 1;
      });
    });

    return stats;
  }, [tasks]);

  return {
    filteredTasks,
    sortedTasks,
    taskStats
  };
} 