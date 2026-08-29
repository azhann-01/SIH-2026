import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  FileText,
  Shield,
  Lightbulb,
  ChevronRight,
  Plus,
  XCircle,
  Building2
} from 'lucide-react'

import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  const [dashboard, setDashboard] = useState({
    companies: [],
    projects: [],
    applications: [],
    compliances: [],
    totalApplications: 0,
    approved: 0,
    pending: 0,
    rejected: 0
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // =========================
  // LOAD DASHBOARD DATA
  // =========================
  const fetchDashboard = async () => {
    if (!user?.id) {
      setError('User information not available. Please login again.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError('')

      console.log('Loading dashboard for user:', user.id)

      const response = await api.get(`/dashboard/${user.id}`)

      console.log('Dashboard data:', response.data)

      setDashboard(response.data)

    } catch (err) {
      console.error('Dashboard loading failed:', err)

      if (err.response) {
        setError(
          err.response.data?.message ||
          err.response.data ||
          `Server error: ${err.response.status}`
        )
      } else {
        setError('Unable to connect to backend server.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [user?.id])

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">

          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-500">
            Loading your dashboard...
          </p>

        </div>
      </div>
    )
  }

  // =========================
  // DATA
  // =========================
  const company = dashboard.companies?.[0]
  const activeProject = dashboard.projects?.[0]

  const applications = dashboard.applications || []
  const compliances = dashboard.compliances || []

  // =========================
  // UPCOMING COMPLIANCE
  // =========================
  const upcomingCompliance = compliances
    .filter(
      item =>
        item.status === 'PENDING' ||
        item.status === 'OVERDUE'
    )
    .slice(0, 3)

  // =========================
  // APPLICATION STATUS
  // =========================
  const getApplicationStatus = (status) => {
    switch (status) {

      case 'APPROVED':
        return {
          label: 'Approved',
          className: 'bg-green-50 text-green-700 border-green-200',
          icon: CheckCircle2
        }

      case 'REJECTED':
        return {
          label: 'Rejected',
          className: 'bg-red-50 text-red-700 border-red-200',
          icon: XCircle
        }

      case 'IN_REVIEW':
        return {
          label: 'In Review',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: Clock
        }

      default:
        return {
          label: 'Submitted',
          className: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock
        }
    }
  }

  // =========================
  // PROJECT PROGRESS
  // =========================
  const projectProgress = activeProject
    ? activeProject.status === 'OPERATIONAL'
      ? 100
      : activeProject.status === 'IN_PROGRESS'
        ? 60
        : activeProject.status === 'SUSPENDED'
          ? 20
          : 25
    : 0

  // =========================
  // STAT CARDS
  // =========================
  const statCards = [
    {
      label: 'Total Approvals',
      value: dashboard.totalApplications,
      icon: FileText,
      color: 'bg-primary-50 text-primary-600'
    },
    {
      label: 'Approved',
      value: dashboard.approved,
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-600'
    },
    {
      label: 'In Progress',
      value: dashboard.pending,
      icon: Clock,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Rejected',
      value: dashboard.rejected,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-600'
    }
  ]

  return (
    <div className="space-y-6">

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.name || 'User'}
          </h1>

          <p className="text-sm text-slate-500 mt-0.5">
            Here's what's happening with your projects and approvals
          </p>

          <span className="inline-flex items-center gap-1.5 mt-2 text-xs text-green-600 font-medium">

            <span className="w-2 h-2 bg-green-500 rounded-full" />

            Live data from backend

          </span>

        </div>

        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>

      </div>


      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}


      {/* =========================
          COMPANY
      ========================= */}
      {company && (
        <div className="bg-white rounded-xl border border-slate-100 p-5">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>

            <div>

              <p className="text-xs text-slate-500">
                Registered Company
              </p>

              <h2 className="text-lg font-bold text-slate-900">
                {company.name}
              </h2>

              <p className="text-xs text-slate-500">
                {company.industryType || 'Industry not specified'}
              </p>

            </div>

          </div>

        </div>
      )}


      {/* =========================
          ACTIVE PROJECT
      ========================= */}
      {activeProject ? (

        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">

          <div className="flex items-start justify-between">

            <div>

              <p className="text-primary-200 text-sm font-medium mb-1">
                Active Project
              </p>

              <h2 className="text-xl font-bold">
                {activeProject.name}
              </h2>

              <p className="text-primary-200 text-sm mt-1">

                {activeProject.location}

                {activeProject.investmentAmount
                  ? ` • ₹${Number(
                      activeProject.investmentAmount
                    ).toLocaleString()}`
                  : ''
                }

              </p>

            </div>

            <Link
              to="/approval-roadmap"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
            >

              View Roadmap

              <ArrowUpRight className="w-4 h-4" />

            </Link>

          </div>


          <div className="mt-4">

            <div className="flex items-center justify-between text-sm mb-1.5">

              <span className="text-primary-200">
                Project Status
              </span>

              <span className="font-semibold">
                {activeProject.status}
              </span>

            </div>

            <div className="h-2 bg-primary-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{
                  width: `${projectProgress}%`
                }}
              />

            </div>

          </div>

        </div>

      ) : (

        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center">

          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />

          <h2 className="font-semibold text-slate-800">
            No project yet
          </h2>

          <p className="text-sm text-slate-500 mt-1 mb-4">
            Create your first project to begin your approval journey.
          </p>

          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >

            <Plus className="w-4 h-4" />

            Create Project

          </Link>

        </div>

      )}


      {/* =========================
          STATISTICS
      ========================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {statCards.map(
          ({
            label,
            value,
            icon: Icon,
            color
          }) => (

            <div
              key={label}
              className="bg-white rounded-xl border border-slate-100 p-5"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    {label}
                  </p>

                  <p className="text-2xl font-bold text-slate-900 mt-0.5">
                    {value}
                  </p>

                </div>

                <div
                  className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
                >

                  <Icon className="w-5 h-5" />

                </div>

              </div>

            </div>

          )
        )}

      </div>


      {/* =========================
          APPLICATIONS + COMPLIANCE
      ========================= */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* APPLICATIONS */}

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100">

          <div className="p-5 border-b border-slate-100 flex items-center justify-between">

            <h3 className="font-semibold text-slate-900">
              Approval Status
            </h3>

            <Link
              to="/approval-roadmap"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-0.5"
            >

              View All

              <ChevronRight className="w-4 h-4" />

            </Link>

          </div>


          {applications.length === 0 ? (

            <div className="p-10 text-center">

              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <p className="font-medium text-slate-700">
                No applications yet
              </p>

              <p className="text-sm text-slate-400 mt-1">
                Your submitted approvals will appear here.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead>

                  <tr className="bg-slate-50/80">

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Approval
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Submitted
                    </th>

                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-50">

                  {applications.slice(0, 5).map(application => {

                    const status =
                      getApplicationStatus(application.status)

                    const StatusIcon = status.icon

                    return (

                      <tr
                        key={application.id}
                        className="hover:bg-slate-50/50"
                      >

                        <td className="px-5 py-3.5">

                          <p className="font-medium text-slate-900">
                            {application.approvalName}
                          </p>

                          {application.remarks && (

                            <p className="text-xs text-slate-400 mt-0.5">
                              {application.remarks}
                            </p>

                          )}

                        </td>


                        <td className="px-5 py-3.5 text-slate-600">

                          {application.submittedAt
                            ? new Date(
                                application.submittedAt
                              ).toLocaleDateString()
                            : '—'
                          }

                        </td>


                        <td className="px-5 py-3.5">

                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.className}`}
                          >

                            <StatusIcon className="w-3 h-3" />

                            {status.label}

                          </span>

                        </td>

                      </tr>

                    )

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* COMPLIANCE */}

        <div className="bg-white rounded-xl border border-slate-100">

          <div className="p-5 border-b border-slate-100">

            <h3 className="font-semibold text-slate-900 flex items-center gap-2">

              <AlertTriangle className="w-4 h-4 text-amber-500" />

              Upcoming Deadlines

            </h3>

          </div>


          {upcomingCompliance.length === 0 ? (

            <div className="p-8 text-center">

              <CheckCircle2 className="w-9 h-9 text-green-400 mx-auto mb-3" />

              <p className="text-sm font-medium text-slate-700">
                No pending deadlines
              </p>

              <p className="text-xs text-slate-400 mt-1">
                You're all caught up.
              </p>

            </div>

          ) : (

            <div className="p-2">

              {upcomingCompliance.map(item => (

                <div
                  key={item.id}
                  className="p-3 rounded-lg hover:bg-slate-50"
                >

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-sm font-medium text-slate-800">
                        {item.title}
                      </p>

                      <p className="text-xs text-slate-400 mt-0.5">
                        Due: {item.dueDate || 'Not specified'}
                      </p>

                    </div>

                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        item.status === 'OVERDUE'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >

                      {item.status === 'OVERDUE'
                        ? 'Overdue'
                        : 'Pending'
                      }

                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}


          <div className="p-4 border-t border-slate-100">

            <Link
              to="/compliance"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-0.5"
            >

              View all compliance items

              <ChevronRight className="w-4 h-4" />

            </Link>

          </div>

        </div>

      </div>


      {/* =========================
          QUICK ACTIONS
      ========================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {[
          {
            label: 'Start New Application',
            icon: FileText,

            // CHANGED: application page instead of approval roadmap
            to: '/new-application',

            color: 'bg-primary-600'
          },
          {
            label: 'Upload Documents',
            icon: Shield,
            to: '/documents',
            color: 'bg-green-600'
          },
          {
            label: 'Find Schemes',
            icon: Lightbulb,
            to: '/schemes',
            color: 'bg-amber-600'
          },
          {
            label: 'Check Compliance',
            icon: CheckCircle2,
            to: '/compliance',
            color: 'bg-blue-600'
          }
        ].map(
          ({
            label,
            icon: Icon,
            to,
            color
          }) => (

            <Link
              key={label}
              to={to}
              className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md hover:border-primary-100 transition-all group"
            >

              <div
                className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >

                <Icon className="w-5 h-5 text-white" />

              </div>

              <p className="text-sm font-medium text-slate-700 group-hover:text-primary-700">
                {label}
              </p>

            </Link>

          )
        )}

      </div>

    </div>
  )
}