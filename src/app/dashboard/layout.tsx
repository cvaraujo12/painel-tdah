"use client"

import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="container mx-auto p-6 pt-20">{children}</main>
      </div>
    </div>
  )
} 