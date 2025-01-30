export interface Task {
  id: string
  text: string
  completed: boolean
}

export interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export interface TaskInputProps {
  value: string
  onChange: (value: string) => void
  onAdd: () => void
} 