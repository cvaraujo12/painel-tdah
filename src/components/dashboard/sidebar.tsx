"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Brain,
  CheckSquare,
  Clock,
  Home,
  LayoutDashboard,
  StickyNote,
} from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Tarefas",
    href: "/dashboard/tarefas",
    icon: CheckSquare,
  },
  {
    title: "Pomodoro",
    href: "/dashboard/pomodoro",
    icon: Clock,
  },
  {
    title: "Notas",
    href: "/dashboard/notas",
    icon: StickyNote,
  },
  {
    title: "Energia",
    href: "/dashboard/energia",
    icon: Brain,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r bg-background lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <Home className="h-6 w-6" />
            <span>Painel TDAH</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4">
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
} 