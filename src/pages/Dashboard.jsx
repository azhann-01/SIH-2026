import { Link } from 'react-router-dom'
import {
  TrendingUp, Clock, AlertTriangle, CheckCircle2,
  ArrowUpRight, FileText, Shield, Lightbulb,
  ChevronRight, MoreHorizontal, Plus
} from 'lucide-react'
import { mockProjects, mockApprovals, mockCompliance } from '../data/mockData'
import { statusColors, statusLabels } from '../data/mockData'

export default function Dashboard() {
  const activeProject = mockProjects[0]
  const projectApprovals = mockApprovals.filter(a => a.projectId === activeProject.id)
  const upcomingCompliance = mockCompliance.filter(c => c.status === 'due_soon' || c.status === 'upcoming').slice(0, 3)
  const approved = projectApprovals.filter(a => a.status === 'approved').length
  const inProgress = projectApprovals.filter(a => a.status === 'in_progress').length
  const pending = projectApprovals.filter(a => a.status === 'pending').length

  const statCards = [
    { label: 'Total Approvals', value: projectApprovals.length, icon: FileText, color: 'bg-primary-50 text-primary-600' },
    { label: 'Approved', value: approved, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
    { label: 'In Progress', value: inProgress, icon: Clock, color: 'bg-blue-50 text-blue-600' },
    { label: 'Pending', value: pending, icon: AlertTriangle, color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Rajesh</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here's what's happening with your projects and approvals</p>
        </div>
        <Link to="/projects" className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> New Project
        </Link>
      </div>

      {/* Active Project Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-primary-200 text-sm font-medium mb-1">Active Project</p>
            <h2 className="text-xl font-bold">{activeProject.name}</h2>
            <p className="text-primary-200 text-sm mt-1">{activeProject.location} • {activeProject.investment}</p>
          </div>
          <Link to="/approval-roadmap" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
            View Roadmap <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-primary-200">Overall Progress</span>
            <span className="font-semibold">{activeProject.progress}%</span>
          </div>
          <div className="h-2 bg-primary-800 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${activeProject.progress}%` }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-100 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Approvals Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Approval Status</h3>
            <Link to="/approval-roadmap" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-0.5">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Approval</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">SLA</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projectApprovals.map(approval => (
                  <tr key={approval.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900">{approval.approval}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{approval.riskFactors} risk</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{approval.department}</td>
                    <td className="px-5 py-3.5 text-slate-600">{approval.sla}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[approval.status]}`}>
                        {statusLabels[approval.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Alerts */}
        <div className="bg-white rounded-xl border border-slate-100">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Upcoming Deadlines
            </h3>
          </div>
          <div className="p-2">
            {upcomingCompliance.map(item => (
              <div key={item.id} className="p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Due: {item.dueDate}</p>
                  </div>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[item.status]}`}>
                    {item.status === 'due_soon' ? 'Due Soon' : 'Upcoming'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100">
            <Link to="/compliance" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-0.5">
              View all compliance items <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Start New Application', icon: FileText, to: '/approval-roadmap', color: 'bg-primary-600' },
          { label: 'Upload Documents', icon: Shield, to: '/documents', color: 'bg-green-600' },
          { label: 'Find Schemes', icon: Lightbulb, to: '/schemes', color: 'bg-amber-600' },
          { label: 'Check Compliance', icon: CheckCircle2, to: '/compliance', color: 'bg-blue-600' },
        ].map(({ label, icon: Icon, to, color }) => (
          <Link key={label} to={to} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md hover:border-primary-100 transition-all group">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-medium text-slate-700 group-hover:text-primary-700 transition-colors">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}