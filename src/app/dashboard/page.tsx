import { Metadata } from "next"
import { Suspense } from "react"

import { TaskList } from "@/components/widgets/task-list"
import { PomodoroTimer } from "@/components/widgets/pomodoro-timer"
import { QuickNotes } from "@/components/widgets/quick-notes"
import { EnergyMeter } from "@/components/widgets/energy-meter"
import { DailyGoals } from "@/components/widgets/daily-goals"
import { ProductivityStats } from "@/components/widgets/productivity-stats"

export const metadata: Metadata = {
  title: "Dashboard | Painel TDAH",
  description: "Painel de controle principal",
}

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Suspense fallback={<div className="h-48 rounded-lg bg-muted animate-pulse" />}>
        <TaskList />
      </Suspense>
      
      <Suspense fallback={<div className="h-48 rounded-lg bg-muted animate-pulse" />}>
        <PomodoroTimer />
      </Suspense>
      
      <Suspense fallback={<div className="h-48 rounded-lg bg-muted animate-pulse" />}>
        <QuickNotes />
      </Suspense>
      
      <Suspense fallback={<div className="h-48 rounded-lg bg-muted animate-pulse" />}>
        <EnergyMeter />
      </Suspense>
      
      <Suspense fallback={<div className="h-48 rounded-lg bg-muted animate-pulse" />}>
        <DailyGoals />
      </Suspense>
      
      <Suspense fallback={<div className="h-48 rounded-lg bg-muted animate-pulse" />}>
        <ProductivityStats />
      </Suspense>
    </div>
  )
} 