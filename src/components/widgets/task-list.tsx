"use client"

import * as React from "react"
import { useQueryState } from "nuqs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  text: string
  completed: boolean
}

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
        />
        <span
          className={cn(
            "text-sm",
            task.completed && "text-muted-foreground line-through"
          )}
        >
          {task.text}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

interface TaskInputProps {
  value: string
  onChange: (value: string) => void
  onAdd: () => void
}

function TaskInput({ value, onChange, onAdd }: TaskInputProps): JSX.Element {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Adicionar nova tarefa..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onAdd()}
      />
      <Button size="icon" onClick={onAdd}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

export function TaskList() {
  const [tasks, setTasks] = useQueryState<Task[]>("tasks", {
    defaultValue: [],
    parse: (value) => JSON.parse(decodeURIComponent(value)),
    serialize: (value) => encodeURIComponent(JSON.stringify(value)),
  })
  const [newTask, setNewTask] = React.useState("")

  const handleAddTask = () => {
    if (!newTask.trim()) return
    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask,
      completed: false,
    }
    setTasks([...tasks, task])
    setNewTask("")
  }

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tarefas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <TaskInput
            value={newTask}
            onChange={setNewTask}
            onAdd={handleAddTask}
          />
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 