import { Suspense } from 'react'
import { TaskListContent } from './task-list-content'
import { TaskListHeader } from './task-list-header'
import { TaskListFilters } from './task-list-filters'
import { LoadingSkeleton } from '@/components/ui/loading'
import { Card } from '@/components/ui/card'
import { Task } from '@/types/Task'

interface TaskListProps {
  initialData: Task[]
}

export function TaskList({ initialData }: TaskListProps) {
  return (
    <Card>
      <TaskListHeader />
      <Suspense fallback={<LoadingSkeleton />}>
        <TaskListFilters />
      </Suspense>
      <Suspense fallback={<LoadingSkeleton />}>
        <TaskListContent initialData={initialData} />
      </Suspense>
    </Card>
  )
} 