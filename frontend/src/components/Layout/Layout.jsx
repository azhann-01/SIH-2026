import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Building2, FolderKanban, Route,
  FileCheck, ShieldCheck, Lightbulb, MessageSquare,
  Users, LogOut, ChevronLeft, ChevronRight, Menu
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/company', icon: Building2, label: 'Company Profile' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/approval-roadmap', icon: Route, label: 'Approval Roadmap' },
  { path: '/documents', icon: FileCheck, label: 'Documents' },
  { path: '/compliance', icon: ShieldCheck, label: 'Compliance' },
  { path: '/schemes', icon: Lightbulb, label: 'Govt Schemes' },
  { path: '/ai-assistant', icon: MessageSquare, label: 'AI Assistant' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className={`
        hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-300
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="ml-3 overflow-hidden">
              <h1 className="text-sm font-bold text-slate-800 tracking-tight">e-Approvals</h1>
              <p className="text-[10px] text-slate-400 font-medium -mt-0.5">Industrial Compliance</p>
            </div>
          )}
        </div>

        {/* Navigation */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}

          {/* Government portal (visible to gov users) */}
          <div className="border-t border-slate-100 pt-3 mt-3">
            <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {!collapsed && 'Government Portal'}
            </p>
            <NavLink
              to="/government-dashboard"
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-gov-50 text-gov-700' : 'text-slate-600 hover:bg-slate-50'}
              `}
            >
              <Users className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="truncate">Govt Dashboard</span>}
            </NavLink>
          </div>
        </nav>

        {/* User & Collapse */}
        <div className="p-3 border-t border-slate-100">
          <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-700">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            )}
            {!collapsed && (
              <button onClick={logout} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center py-2 text-slate-400 hover:text-slate-600 mt-1"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-slate-200 z-50 flex items-center px-4">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 -ml-2">
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex items-center gap-2 ml-3">
          <div className="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">e-Approvals</span>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setMobileOpen(false)}>
          <div className="w-[260px] h-full bg-white shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="h-14 flex items-center px-4 border-b border-slate-100">
              <div className="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-800 text-sm ml-2">e-Approvals</span>
            </div>
            <nav className="py-4 px-3 space-y-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}
                  `}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-100">
              <button onClick={() => { logout(); setMobileOpen(false) }} className="flex items-center gap-2 text-sm text-red-600 font-medium">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-0 overflow-auto">
        <div className="lg:hidden h-14" /> {/* Spacer for mobile header */}
        <Outlet />
      </main>
    </div>
  )
}