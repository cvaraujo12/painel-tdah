"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { TaskItemProps, TaskInputProps } from "./types"

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
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

export function TaskInput({ value, onChange, onAdd }: TaskInputProps) {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Adicionar nova tarefa..."
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent) => e.key === "Enter" && onAdd()}
      />
      <Button size="icon" onClick={onAdd}>
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
} 