import { useEffect, useState } from 'react'
import {
  Plus,
  MapPin,
  IndianRupee,
  Users,
  ChevronRight,
  Calendar,
  Building2,
  X
} from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Projects() {

  const { user } = useAuth()

  const [projects, setProjects] = useState([])
  const [company, setCompany] = useState(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    investmentAmount: '',
    numberOfEmployees: '',
    landType: ''
  })

  // =========================
  // LOAD COMPANY + PROJECTS
  // =========================

  const loadData = async () => {

    try {

      setLoading(true)
      setError('')

      if (!user?.id) {
        setError('User information not available. Please login again.')
        return
      }

      // Get user's companies
      const companyResponse = await api.get(
        `/company/owner/${user.id}`
      )

      const companies = companyResponse.data || []

      if (companies.length === 0) {
        setCompany(null)
        setProjects([])
        return
      }

      const currentCompany = companies[0]

      setCompany(currentCompany)

      // Get projects belonging to company
      const projectResponse = await api.get(
        `/project/company/${currentCompany.id}`
      )

      setProjects(projectResponse.data || [])

    } catch (err) {

      console.error('Failed to load projects:', err)

      setError(
        err.response?.data ||
        'Unable to load projects'
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    loadData()
  }, [user?.id])


  // =========================
  // FORM HANDLING
  // =========================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }


  // =========================
  // CREATE PROJECT
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!company?.id) {
      setError('No company found. Please register a company first.')
      return
    }

    try {

      setSaving(true)
      setError('')

      const payload = {
        name: form.name,
        description: form.description,
        location: form.location,
        investmentAmount: Number(form.investmentAmount),
        numberOfEmployees: Number(form.numberOfEmployees),
        landType: form.landType
      }

      await api.post(
        `/project/${company.id}`,
        payload
      )

      // Clear form
      setForm({
        name: '',
        description: '',
        location: '',
        investmentAmount: '',
        numberOfEmployees: '',
        landType: ''
      })

      setShowForm(false)

      // Reload projects from backend
      await loadData()

    } catch (err) {

      console.error('Project creation failed:', err)

      setError(
        err.response?.data ||
        'Unable to create project'
      )

    } finally {

      setSaving(false)

    }
  }


  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div className="flex items-center justify-center min-h-[400px]">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-500">
            Loading your projects...
          </p>

        </div>

      </div>
    )

  }


  return (

    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Projects
          </h1>

          <p className="text-sm text-slate-500 mt-0.5">
            Manage your industrial projects
          </p>

          {company && (
            <p className="text-xs text-green-600 mt-2 font-medium">
              Connected to {company.name}
            </p>
          )}

        </div>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>

      </div>


      {/* ================= ERROR ================= */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>

      )}


      {/* ================= NO COMPANY ================= */}

      {!company && (

        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">

          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />

          <h2 className="text-lg font-semibold text-slate-800">
            No company registered
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Please register your company before creating a project.
          </p>

        </div>

      )}


      {/* ================= NO PROJECTS ================= */}

      {company && projects.length === 0 && (

        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">

          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />

          <h2 className="text-lg font-semibold text-slate-800">
            No projects yet
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-5">
            Create your first industrial project to begin your approval journey.
          </p>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Create Project
          </button>

        </div>

      )}


      {/* ================= PROJECT CARDS ================= */}

      {projects.length > 0 && (

        <div className="grid md:grid-cols-2 gap-6">

          {projects.map(project => (

            <div
              key={project.id}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all"
            >

              <div className="p-6">

                {/* Project Header */}

                <div className="flex items-start justify-between">

                  <div>

                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200">

                      {project.status || 'PLANNING'}

                    </span>

                    <h3 className="font-semibold text-slate-900 mt-2">
                      {project.name}
                    </h3>

                    <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">

                      <MapPin className="w-3.5 h-3.5" />

                      {project.location || 'Location not specified'}

                    </div>

                  </div>

                </div>


                {/* Project Description */}

                {project.description && (

                  <p className="text-sm text-slate-500 mt-4">
                    {project.description}
                  </p>

                )}


                {/* Project Details */}

                <div className="grid grid-cols-2 gap-3 mt-4">

                  <div className="p-3 rounded-lg bg-slate-50">

                    <div className="flex items-center gap-1.5">

                      <IndianRupee className="w-4 h-4 text-slate-400" />

                      <p className="text-xs text-slate-500">
                        Investment
                      </p>

                    </div>

                    <p className="text-sm font-semibold text-slate-900 mt-1">

                      {project.investmentAmount
                        ? `₹${Number(project.investmentAmount).toLocaleString('en-IN')}`
                        : '—'
                      }

                    </p>

                  </div>


                  <div className="p-3 rounded-lg bg-slate-50">

                    <div className="flex items-center gap-1.5">

                      <Users className="w-4 h-4 text-slate-400" />

                      <p className="text-xs text-slate-500">
                        Employees
                      </p>

                    </div>

                    <p className="text-sm font-semibold text-slate-900 mt-1">

                      {project.numberOfEmployees || '—'}

                    </p>

                  </div>

                </div>


                {/* Land Type */}

                {project.landType && (

                  <div className="mt-3 p-3 rounded-lg bg-slate-50">

                    <p className="text-xs text-slate-500">
                      Land Type
                    </p>

                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {project.landType}
                    </p>

                  </div>

                )}


                {/* Footer */}

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">

                  <div className="flex items-center gap-1 text-xs text-slate-400">

                    <Calendar className="w-3.5 h-3.5" />

                    Project #{project.id}

                  </div>

                  <button
                    onClick={() => {
                      window.location.href = '/approval-roadmap'
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-0.5"
                  >

                    View Approvals

                    <ChevronRight className="w-4 h-4" />

                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* ================= CREATE PROJECT MODAL ================= */}

      {showForm && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}

            <div className="flex items-center justify-between p-6 border-b border-slate-100">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Create New Project
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Add your industrial project details
                </p>

              </div>

              <button
                onClick={() => setShowForm(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >

                <X className="w-5 h-5" />

              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              {/* Name */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Project Name
                </label>

                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Food Processing Plant"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

              </div>


              {/* Description */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Brief description of the project"
                  rows="3"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

              </div>


              {/* Location */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Location
                </label>

                <input
                  required
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Gurugram, Haryana"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

              </div>


              {/* Investment */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Investment Amount
                </label>

                <input
                  required
                  type="number"
                  min="0"
                  name="investmentAmount"
                  value={form.investmentAmount}
                  onChange={handleChange}
                  placeholder="e.g. 50000000"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

              </div>


              {/* Employees */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Number of Employees
                </label>

                <input
                  required
                  type="number"
                  min="1"
                  name="numberOfEmployees"
                  value={form.numberOfEmployees}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

              </div>


              {/* Land Type */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Land Type
                </label>

                <select
                  required
                  name="landType"
                  value={form.landType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >

                  <option value="">
                    Select land type
                  </option>

                  <option value="INDUSTRIAL">
                    Industrial
                  </option>

                  <option value="COMMERCIAL">
                    Commercial
                  </option>

                  <option value="GOVERNMENT">
                    Government
                  </option>

                  <option value="PRIVATE">
                    Private
                  </option>

                </select>

              </div>


              {/* Buttons */}

              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-60"
                >

                  {saving
                    ? 'Creating...'
                    : 'Create Project'
                  }

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>

  )
}