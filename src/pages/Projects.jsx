import { Link } from 'react-router-dom'
import { Plus, MapPin, IndianRupee, Users, MoreHorizontal, ChevronRight, Calendar } from 'lucide-react'
import { mockProjects } from '../data/mockData'

export default function Projects() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your industrial projects</p>
        </div>
        <button className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mockProjects.map(project => (
          <div key={project.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg hover:border-primary-100 transition-all group">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${project.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {project.status === 'active' ? 'Active' : 'Planning'}
                  </span>
                  <h3 className="font-semibold text-slate-900 mt-2 group-hover:text-primary-700 transition-colors">{project.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {project.location}
                  </div>
                </div>
                <button className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500">Investment</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{project.investment}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500">Employees</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{project.employees}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500">Land Area</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{project.landArea}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-semibold text-slate-700">{project.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Created {project.createdAt}
                </div>
                <Link to="/approval-roadmap" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-0.5">
                  View Approvals <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}