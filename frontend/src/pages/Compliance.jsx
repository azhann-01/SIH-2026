import { useState } from 'react'
import {
  ShieldCheck, Calendar, AlertTriangle, CheckCircle2, Clock,
  Filter, Bell, Plus, ChevronRight, MoreHorizontal
} from 'lucide-react'
import { mockCompliance } from '../data/mockData'
import { statusColors, statusLabels } from '../data/mockData'

export default function Compliance() {
  const [compliance] = useState(mockCompliance)
  const [filter, setFilter] = useState('all')

  const filtered = compliance.filter(c => filter === 'all' || c.status === filter)

  const stats = {
    total: compliance.length,
    upcoming: compliance.filter(c => c.status === 'upcoming').length,
    dueSoon: compliance.filter(c => c.status === 'due_soon').length,
    overdue: compliance.filter(c => c.status === 'overdue').length,
  }

  const priorityColors = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    low: 'text-green-600 bg-green-50 border-green-200',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Compliance</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track renewals, audits, and regulatory filings</p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700">
          <Plus className="w-4 h-4" /> Add Compliance Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: stats.total, icon: ShieldCheck, color: 'bg-primary-50 text-primary-600' },
          { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'bg-blue-50 text-blue-600' },
          { label: 'Due Soon', value: stats.dueSoon, icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
          { label: 'Overdue', value: stats.overdue, icon: AlertTriangle, color: 'bg-red-50 text-red-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <select value={filter} onChange={e => setFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
            <option value="all">All Items</option>
            <option value="upcoming">Upcoming</option>
            <option value="due_soon">Due Soon</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
          <Bell className="w-4 h-4" /> Set Reminders
        </button>
      </div>

      {/* Compliance List */}
      <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-50">
        {filtered.map(item => (
          <div key={item.id} className="p-5 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.priority === 'high' ? 'bg-red-50 text-red-600' : item.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.type} • {item.frequency}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${priorityColors[item.priority]}`}>
                      {item.priority} priority
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-slate-100 text-slate-600 border-slate-200">
                      {item.reminder}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.dueDate}
                </div>
                <span className={`mt-2 inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[item.status]}`}>
                  {item.status === 'due_soon' ? 'Due Soon' : statusLabels[item.status]}
                </span>
                <button className="mt-2 p-1 rounded-md hover:bg-slate-100 text-slate-400">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}