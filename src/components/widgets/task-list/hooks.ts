import { useState } from "react"
import { useQueryState } from "nuqs"
import { Task } from "./types"

export function useTaskList() {
  const [tasks, setTasks] = useQueryState<Task[]>("tasks", {
    defaultValue: [],
    parse: (value: string) => JSON.parse(decodeURIComponent(value)),
    serialize: (value: Task[]) => encodeURIComponent(JSON.stringify(value)),
  })
  const [newTask, setNewTask] = useState("")

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
      tasks.map((task: Task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task: Task) => task.id !== id))
  }

  return {
    tasks,
    newTask,
    setNewTask,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
  }
} 