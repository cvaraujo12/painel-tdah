'use client'

import { useCallback } from 'react'
import { useQueryState } from 'nuqs'
import { Task } from '@/types/Task'
import { useTaskState } from '@/hooks/useTaskState'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2, Edit } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskListContentProps {
  initialData: Task[]
}

export function TaskListContent({ initialData }: TaskListContentProps) {
  const [tasks, setTasks] = useQueryState<Task[]>('tasks', {
    defaultValue: initialData,
    parse: (value) => JSON.parse(decodeURIComponent(value)),
    serialize: (value) => encodeURIComponent(JSON.stringify(value)),
  })

  const [filter] = useQueryState('filter')
  const { filteredTasks } = useTaskState(tasks, { searchTerm: filter })

  const handleToggle = useCallback(
    (id: string) => {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      )
    },
    [tasks, setTasks]
  )

  const handleDelete = useCallback(
    (id: string) => {
      setTasks(tasks.filter((task) => task.id !== id))
    },
    [tasks, setTasks]
  )

  return (
    <CardContent className="divide-y">
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between py-4"
        >
          <div className="flex items-center gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => handleToggle(task.id)}
            />
            <span
              className={cn(
                'text-sm',
                task.completed && 'text-muted-foreground line-through'
              )}
            >
              {task.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </CardContent>
  )
} 