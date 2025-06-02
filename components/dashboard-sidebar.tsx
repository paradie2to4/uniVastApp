"use client"

import type React from "react"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItem {
  icon: React.ReactNode
  label: string
  tab: string
}

interface DashboardSidebarProps {
  items: SidebarItem[]
  activeTab: string
  onTabChange: (tab: string) => void
  logoIcon: React.ReactNode
  logoText: string
  onLogout: () => void
}

export default function DashboardSidebar({ items, activeTab, onTabChange, logoIcon, logoText, onLogout }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-purple-100 transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-4 border-b border-purple-100">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
            {logoIcon}
          </div>
          {!collapsed && <span className="ml-3 text-xl font-bold text-purple-800">{logoText}</span>}
        </div>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {items.map((item) => (
            <li key={item.tab}>
              <button
                className={cn(
                  "w-full flex items-center px-3 py-2 rounded-md transition-colors",
                  activeTab === item.tab
                    ? "bg-purple-50 text-purple-800"
                    : "text-gray-600 hover:bg-purple-50 hover:text-purple-800",
                )}
                onClick={() => onTabChange(item.tab)}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-purple-100">
        <button 
          className="w-full flex items-center px-3 py-2 rounded-md text-gray-600 hover:bg-purple-50 hover:text-purple-800 transition-colors"
          onClick={onLogout}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </aside>
  )
}
