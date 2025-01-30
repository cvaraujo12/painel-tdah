import { render, screen, fireEvent } from '@testing-library/react'
import { TaskList } from '@/components/widgets/task-list'
import { Task } from '@/types/Task'

// Mock do useQueryState
jest.mock('nuqs', () => ({
  useQueryState: jest.fn().mockImplementation((key, options) => {
    return [options.defaultValue, jest.fn()]
  }),
}))

describe('TaskList', () => {
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
  ]

  it('deve renderizar a lista de tarefas', () => {
    render(<TaskList initialData={mockTasks} />)
    
    expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
    expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
  })

  it('deve mostrar o status de conclusão correto', () => {
    render(<TaskList initialData={mockTasks} />)
    
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).toBeChecked()
  })

  it('deve ter botões de ação para cada tarefa', () => {
    render(<TaskList initialData={mockTasks} />)
    
    const editButtons = screen.getAllByRole('button', { name: /editar/i })
    const deleteButtons = screen.getAllByRole('button', { name: /excluir/i })
    
    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })

  it('deve aplicar estilo de riscado em tarefas concluídas', () => {
    render(<TaskList initialData={mockTasks} />)
    
    const completedTask = screen.getByText('Tarefa 2')
    expect(completedTask).toHaveClass('line-through')
  })

  it('deve mostrar loading skeleton durante o carregamento', () => {
    render(<TaskList initialData={[]} />)
    
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })
}) 