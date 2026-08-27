import { useState } from 'react'
import { Lightbulb, ExternalLink, Search, Filter, Star, Clock, Tag, CheckCircle2 } from 'lucide-react'
import { mockSchemes } from '../data/mockData'

const sectors = ['All', 'Food Processing', 'Pharmaceuticals', 'Chemicals', 'All Industries']

export default function Schemes() {
  const [schemes] = useState(mockSchemes)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSector, setFilterSector] = useState('all')
  const [expandedScheme, setExpandedScheme] = useState(null)

  const filtered = schemes.filter(s => {
    if (filterSector !== 'all' && s.sector !== filterSector) return false
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.ministry.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Government Schemes</h1>
        <p className="text-sm text-slate-500 mt-0.5">Discover central and state schemes applicable to your business</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search schemes, ministries..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select value={filterSector} onChange={e => setFilterSector(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm">
          {sectors.map(s => <option key={s} value={s.toLowerCase()}>{s}</option>)}
        </select>
      </div>

      {/* Scheme Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map(scheme => {
          const isExpanded = expandedScheme === scheme.id
          return (
            <div key={scheme.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md hover:border-primary-100 transition-all">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{scheme.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{scheme.ministry}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-200 shrink-0">
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-3 leading-relaxed">{scheme.benefits}</p>

                <div className="mt-3 p-3 rounded-lg bg-slate-50">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Eligibility</p>
                  <p className="text-xs text-slate-600">{scheme.eligibility}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {scheme.tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary-50 text-primary-600 border border-primary-100">
                      <Tag className="w-2.5 h-2.5" /> {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setExpandedScheme(isExpanded ? null : scheme.id)}
                  className="mt-3 w-full flex items-center justify-between py-2 text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  <span>{isExpanded ? 'Less details' : 'More details'}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="mt-3 space-y-3 animate-in">
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                      <p className="text-[10px] font-medium text-amber-500 uppercase tracking-wider mb-1">Benefits</p>
                      <p className="text-xs text-amber-700">{scheme.benefits}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        Last date: {scheme.lastDate}
                      </div>
                      <a
                        href={scheme.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        Apply <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}