import { useState } from 'react'
import {
  Upload, FileText, CheckCircle2, Clock, XCircle,
  AlertTriangle, Search, Filter, Eye, Download,
  FileCheck, FileX, Trash2, Plus, ChevronDown
} from 'lucide-react'
import { mockDocuments } from '../data/mockData'
import { statusColors, statusLabels } from '../data/mockData'

const documentTypes = ['All', 'Identity', 'Tax', 'Approval', 'Technical', 'Utility', 'Application']

export default function Documents() {
  const [docs, setDocs] = useState(mockDocuments)
  const [filterType, setFilterType] = useState('all')
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [uploadModal, setUploadModal] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const filteredDocs = docs.filter(d => filterType === 'all' || d.type === filterType)

  const statusIcon = (status) => {
    if (status === 'verified') return <CheckCircle2 className="w-4 h-4 text-green-600" />
    if (status === 'processing') return <Clock className="w-4 h-4 text-blue-600" />
    if (status === 'rejected') return <XCircle className="w-4 h-4 text-red-600" />
    return <FileText className="w-4 h-4 text-slate-400" />
  }

  const stats = {
    total: docs.length,
    verified: docs.filter(d => d.status === 'verified').length,
    processing: docs.filter(d => d.status === 'processing').length,
    rejected: docs.filter(d => d.status === 'rejected').length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
          <p className="text-sm text-slate-500 mt-0.5">Upload, manage, and track your project documents</p>
        </div>
        <button onClick={() => setUploadModal(true)} className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700">
          <Plus className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: stats.total, icon: FileText, color: 'bg-primary-50 text-primary-600' },
          { label: 'Verified', value: stats.verified, icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
          { label: 'Processing', value: stats.processing, icon: Clock, color: 'bg-blue-50 text-blue-600' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-50 text-red-600' },
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
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input placeholder="Search documents..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
            {documentTypes.map(t => <option key={t} value={t.toLowerCase().replace('all', 'all')}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map(doc => (
          <div
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md hover:border-primary-100 cursor-pointer transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                {statusIcon(doc.status)}
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusColors[doc.status]}`}>
                {statusLabels[doc.status]}
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-slate-900">{doc.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{doc.type} • {doc.size}</p>
              <p className="text-xs text-slate-400 mt-1">Uploaded {doc.uploadedAt}</p>
            </div>

            {/* AI Extraction Badge */}
            {doc.extractedData && (
              <div className="mt-3 p-2.5 rounded-lg bg-primary-50 border border-primary-100">
                <p className="text-[10px] font-semibold text-primary-700 uppercase tracking-wider mb-1">AI Extracted</p>
                <div className="space-y-0.5">
                  {Object.entries(doc.extractedData).slice(0, 3).map(([key, val]) => (
                    <p key={key} className="text-[11px] text-primary-600">
                      <span className="text-primary-400 capitalize">{key}:</span> {val}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {doc.rejectionReason && (
              <div className="mt-3 p-2.5 rounded-lg bg-red-50 border border-red-100">
                <p className="text-[11px] text-red-600"><span className="font-medium">Rejection:</span> {doc.rejectionReason}</p>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50">
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setUploadModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-slate-900">Upload Document</h3>
              <button onClick={() => setUploadModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100">
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); setUploadModal(false) }}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${dragOver ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-primary-300'}`}
            >
              <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Drag & drop files here, or click to browse</p>
              <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>

            <div className="mt-5 space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                  <option>Select type...</option>
                  <option>Identity Proof</option>
                  <option>Tax Document</option>
                  <option>Technical Document</option>
                  <option>Utility Bill</option>
                  <option>Approval Certificate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project</label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm">
                  <option>Spice Processing Unit Phase 2</option>
                  <option>Frozen Vegetable Packaging Line</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={() => setUploadModal(false)} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={() => setUploadModal(false)} className="flex-1 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDoc(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedDoc.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{selectedDoc.type} • {selectedDoc.size}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedDoc.status]}`}>
                    {statusLabels[selectedDoc.status]}
                  </span>
                  <button onClick={() => setSelectedDoc(null)} className="p-1.5 rounded-lg hover:bg-slate-100">
                    <XCircle className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500">Uploaded On</p>
                  <p className="text-sm font-medium text-slate-900">{selectedDoc.uploadedAt}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50">
                  <p className="text-xs text-slate-500">Verified On</p>
                  <p className="text-sm font-medium text-slate-900">{selectedDoc.verifiedAt || 'Not yet verified'}</p>
                </div>
              </div>

              {selectedDoc.extractedData && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-primary-600" />
                    AI-Extracted Data
                  </h4>
                  <div className="bg-primary-50 rounded-xl border border-primary-100 p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedDoc.extractedData).map(([key, val]) => (
                        <div key={key}>
                          <p className="text-[10px] text-primary-400 font-medium uppercase tracking-wider">{key}</p>
                          <p className="text-sm font-medium text-primary-700 mt-0.5">{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedDoc.rejectionReason && (
                <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100">
                  <h4 className="text-sm font-semibold text-red-700 mb-1 flex items-center gap-1.5">
                    <FileX className="w-4 h-4" />
                    Rejection Reason
                  </h4>
                  <p className="text-sm text-red-600">{selectedDoc.rejectionReason}</p>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <Eye className="w-4 h-4" /> Preview Document
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}