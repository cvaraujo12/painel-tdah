import { Suspense } from 'react'
import { TaskList } from '@/components/widgets/task-list'
import { Loading } from '@/components/ui/loading'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { fetchTasks } from '@/lib/api'

export const metadata = {
  title: 'Tarefas | Painel TDAH',
  description: 'Gerencie suas tarefas de forma eficiente',
}

async function TasksContent() {
  const tasks = await fetchTasks()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
      </div>
      <TaskList initialData={tasks} />
    </div>
  )
}

export default function TasksPage() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <Loading
            className="min-h-[400px]"
            size="lg"
            text="Carregando tarefas..."
          />
        }
      >
        <TasksContent />
      </Suspense>
    </ErrorBoundary>
  )
} 