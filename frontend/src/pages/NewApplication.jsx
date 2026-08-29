import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, ArrowLeft, Send } from 'lucide-react'

import api from '../services/api'

export default function NewApplication() {
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [projectId, setProjectId] = useState('')
  const [approvalName, setApprovalName] = useState('')
  const [remarks, setRemarks] = useState('')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'))

        if (!user?.id) {
          setError('User information not available. Please login again.')
          return
        }

        const response = await api.get(`/dashboard/${user.id}`)

        const userProjects = response.data.projects || []

        setProjects(userProjects)

        if (userProjects.length > 0) {
          setProjectId(String(userProjects[0].id))
        }
      } catch (err) {
        console.error('Failed to load projects:', err)
        setError('Unable to load your projects.')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!projectId) {
      setError('Please select a project.')
      return
    }

    if (!approvalName.trim()) {
      setError('Please enter an approval name.')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      await api.post(`/application/${projectId}`, {
        approvalName: approvalName.trim(),
        remarks: remarks.trim()
      })

      navigate('/approval-roadmap')
    } catch (err) {
      console.error('Application creation failed:', err)

      setError(
        err.response?.data ||
        'Failed to create application.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm text-slate-500">
          Loading projects...
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Start New Application
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Submit an approval application for your project
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-6">

        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Project */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Project
            </label>

            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">
                Select project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Approval Name */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Approval Name
            </label>

            <input
              type="text"
              value={approvalName}
              onChange={(e) => setApprovalName(e.target.value)}
              placeholder="e.g. Pollution NOC"
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          {/* Remarks */}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Remarks
            </label>

            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter any additional information..."
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Submit */}

          <div className="flex justify-end pt-2">

            <button
              type="submit"
              disabled={submitting || projects.length === 0}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
            >
              <Send className="w-4 h-4" />

              {submitting
                ? 'Submitting...'
                : 'Submit Application'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}