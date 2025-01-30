import { renderHook, act } from '@testing-library/react';
import { useTaskState } from '@/hooks/useTaskState';
import { Task } from '@/types/Task';

describe('useTaskState', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Tarefa 1',
      completed: false,
      priority: 'alta',
      category: 'trabalho',
      tags: ['importante'],
      due_date: new Date('2024-02-01').toISOString(),
      created_at: new Date('2024-01-01').toISOString(),
    },
    {
      id: '2',
      title: 'Tarefa 2',
      completed: true,
      priority: 'baixa',
      category: 'pessoal',
      tags: ['rotina'],
      due_date: new Date('2024-02-02').toISOString(),
      created_at: new Date('2024-01-02').toISOString(),
    },
  ];

  it('deve filtrar tarefas por termo de busca', () => {
    const { result } = renderHook(() =>
      useTaskState(mockTasks, { searchTerm: 'Tarefa 1' })
    );
    
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].id).toBe('1');
  });

  it('deve filtrar tarefas por prioridade', () => {
    const { result } = renderHook(() =>
      useTaskState(mockTasks, { priority: 'alta' })
    );
    
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].priority).toBe('alta');
  });

  it('deve filtrar tarefas por status de conclusão', () => {
    const { result } = renderHook(() =>
      useTaskState(mockTasks, { completed: true })
    );
    
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].completed).toBe(true);
  });

  it('deve filtrar tarefas por categoria', () => {
    const { result } = renderHook(() =>
      useTaskState(mockTasks, { category: 'trabalho' })
    );
    
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].category).toBe('trabalho');
  });

  it('deve filtrar tarefas por tags', () => {
    const { result } = renderHook(() =>
      useTaskState(mockTasks, { tags: ['importante'] })
    );
    
    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].tags).toContain('importante');
  });

  it('deve calcular estatísticas corretamente', () => {
    const { result } = renderHook(() => useTaskState(mockTasks, {}));
    
    expect(result.current.taskStats).toEqual({
      total: 2,
      completed: 1,
      pending: 1,
      overdue: expect.any(Number),
      byPriority: {
        alta: 1,
        média: 0,
        baixa: 1,
      },
      byCategory: {
        trabalho: 1,
        pessoal: 1,
      },
      byTag: {
        importante: 1,
        rotina: 1,
      },
    });
  });

  it('deve ordenar tarefas corretamente', () => {
    const { result } = renderHook(() => useTaskState(mockTasks, {}));
    
    const sortedTasks = result.current.sortedTasks;
    expect(sortedTasks[0].priority).toBe('alta');
    expect(sortedTasks[1].priority).toBe('baixa');
  });
}); 