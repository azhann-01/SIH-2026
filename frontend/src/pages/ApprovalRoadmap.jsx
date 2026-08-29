import { useEffect, useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
} from 'reactflow'

import 'reactflow/dist/style.css'

import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Filter,
  Search,
  RefreshCw,
} from 'lucide-react'

import api from '../services/api'
import { useAuth } from '../context/AuthContext'


const statusIcons = {
  APPROVED: CheckCircle2,
  IN_REVIEW: Clock,
  SUBMITTED: AlertTriangle,
  REJECTED: XCircle,
}


const statusColors = {
  APPROVED: {
    bg: '#dcfce7',
    border: '#22c55e',
    text: '#15803d',
  },

  IN_REVIEW: {
    bg: '#dbeafe',
    border: '#3b82f6',
    text: '#1d4ed8',
  },

  SUBMITTED: {
    bg: '#fef3c7',
    border: '#f59e0b',
    text: '#92400e',
  },

  REJECTED: {
    bg: '#fee2e2',
    border: '#ef4444',
    text: '#b91c1c',
  },
}


function getStatusLabel(status) {
  switch (status) {
    case 'APPROVED':
      return 'Approved'

    case 'IN_REVIEW':
      return 'In Review'

    case 'REJECTED':
      return 'Rejected'

    case 'SUBMITTED':
      return 'Submitted'

    default:
      return status || 'Unknown'
  }
}


function ApprovalNode({ data }) {

  const colors =
    statusColors[data.status] || statusColors.SUBMITTED

  const Icon =
    statusIcons[data.status] || AlertTriangle

  return (
    <div
      className="bg-white rounded-xl shadow-lg border-2 min-w-[230px]"
      style={{ borderColor: colors.border }}
    >

      <div
        className="px-4 py-3 rounded-t-[10px]"
        style={{ backgroundColor: colors.bg }}
      >

        <div className="flex items-center gap-2">

          <Icon
            className="w-4 h-4"
            style={{ color: colors.text }}
          />

          <span
            className="text-sm font-semibold"
            style={{ color: colors.text }}
          >
            {data.approvalName}
          </span>

        </div>

      </div>


      <div className="p-4">

        <p className="text-xs text-slate-500 mb-2">
          Application #{data.id}
        </p>

        <span
          className="inline-flex text-[10px] px-2 py-1 rounded-full font-medium"
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
          }}
        >
          {getStatusLabel(data.status)}
        </span>


        {data.submittedAt && (

          <p className="text-[10px] text-slate-400 mt-3">
            Submitted:{' '}
            {new Date(data.submittedAt).toLocaleDateString()}
          </p>

        )}


        {data.slaDeadline && (

          <p className="text-[10px] text-slate-400 mt-1">
            SLA:{' '}
            {new Date(data.slaDeadline).toLocaleDateString()}
          </p>

        )}


        {data.remarks && (

          <p className="text-[10px] text-slate-500 mt-2">
            {data.remarks}
          </p>

        )}

      </div>


      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-slate-400"
      />

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-slate-400"
      />

    </div>
  )
}


const nodeTypes = {
  approvalNode: ApprovalNode,
}


export default function ApprovalRoadmap() {

  const { user } = useAuth()

  const [applications, setApplications] = useState([])

  const [project, setProject] = useState(null)

  const [loading, setLoading] = useState(true)

  const [refreshing, setRefreshing] = useState(false)

  const [error, setError] = useState('')

  const [filterStatus, setFilterStatus] = useState('all')

  const [searchQuery, setSearchQuery] = useState('')

  const [selectedApproval, setSelectedApproval] = useState(null)


  /*
   * Load user's project and applications
   */

  const fetchApplications = async () => {

    try {

      setError('')

      if (!user?.id) {
        setError('User information not available. Please login again.')
        return
      }


      /*
       * First get dashboard.
       * Dashboard already returns the user's projects.
       */

      const dashboardResponse =
        await api.get(`/dashboard/${user.id}`)

      const projects =
        dashboardResponse.data?.projects || []


      if (projects.length === 0) {

        setProject(null)
        setApplications([])

        return
      }


      const activeProject = projects[0]

      setProject(activeProject)


      /*
       * Now get REAL applications from MySQL
       */

      const applicationResponse =
        await api.get(
          `/application/project/${activeProject.id}`
        )


      setApplications(
        applicationResponse.data || []
      )

    } catch (err) {

      console.error(
        'Failed to load applications:',
        err
      )

      setError(
        err.response?.data ||
        err.message ||
        'Unable to load applications'
      )

    } finally {

      setLoading(false)
      setRefreshing(false)

    }
  }


  useEffect(() => {

    fetchApplications()

  }, [user?.id])


  const handleRefresh = async () => {

    setRefreshing(true)

    await fetchApplications()

  }


  /*
   * Filter applications
   */

  const filteredApplications = useMemo(() => {

    return applications.filter(application => {

      if (
        filterStatus !== 'all' &&
        application.status !== filterStatus
      ) {
        return false
      }


      if (searchQuery) {

        const query =
          searchQuery.toLowerCase()

        return (
          application.approvalName
            ?.toLowerCase()
            .includes(query) ||

          application.remarks
            ?.toLowerCase()
            .includes(query)
        )
      }


      return true

    })

  }, [
    applications,
    filterStatus,
    searchQuery
  ])


  /*
   * Build React Flow nodes
   */

  const nodes = useMemo(() => {

    return filteredApplications.map(
      (application, index) => {

        const cols = 2

        const row =
          Math.floor(index / cols)

        const col =
          index % cols


        return {

          id: String(application.id),

          type: 'approvalNode',

          position: {
            x: 100 + col * 350,
            y: row * 260,
          },

          data: application,

        }

      }
    )

  }, [filteredApplications])


  /*
   * Connect applications sequentially.
   *
   * Your current backend does not store
   * application dependencies, so we cannot
   * invent dependency relationships.
   */

  const edges = useMemo(() => {

    const result = []

    for (
      let i = 0;
      i < filteredApplications.length - 1;
      i++
    ) {

      const current =
        filteredApplications[i]

      const next =
        filteredApplications[i + 1]


      result.push({

        id: `${current.id}-${next.id}`,

        source: String(current.id),

        target: String(next.id),

        type: 'smoothstep',

        animated:
          current.status === 'IN_REVIEW',

        style: {
          stroke:
            current.status === 'IN_REVIEW'
              ? '#6366f1'
              : '#cbd5e1',

          strokeWidth: 2,
        },

        markerEnd: {
          type: MarkerType.ArrowClosed,

          color:
            current.status === 'IN_REVIEW'
              ? '#6366f1'
              : '#cbd5e1',
        },

      })

    }

    return result

  }, [filteredApplications])


  /*
   * Statistics
   */

  const total =
    applications.length

  const approved =
    applications.filter(
      a => a.status === 'APPROVED'
    ).length

  const inReview =
    applications.filter(
      a => a.status === 'IN_REVIEW'
    ).length

  const submitted =
    applications.filter(
      a => a.status === 'SUBMITTED'
    ).length

  const rejected =
    applications.filter(
      a => a.status === 'REJECTED'
    ).length


  /*
   * Loading
   */

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-[400px]">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm text-slate-500">
            Loading applications...
          </p>

        </div>

      </div>

    )

  }


  return (

    <div className="space-y-6">


      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Approval Roadmap
          </h1>

          <p className="text-sm text-slate-500 mt-0.5">
            Track your real approval applications and their status
          </p>

          {project && (

            <p className="text-xs text-green-600 mt-2">
              ● Live data · {project.name}
            </p>

          )}

        </div>


        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >

          <RefreshCw
            className={`w-4 h-4 ${
              refreshing
                ? 'animate-spin'
                : ''
            }`}
          />

          {refreshing
            ? 'Refreshing...'
            : 'Refresh'}

        </button>

      </div>


      {/* Error */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>

      )}


      {/* Statistics */}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">


        <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">

          <p className="text-2xl font-bold text-primary-600">
            {total}
          </p>

          <p className="text-xs text-primary-600 mt-1">
            Total
          </p>

        </div>


        <div className="rounded-xl border border-green-100 bg-green-50 p-4">

          <p className="text-2xl font-bold text-green-600">
            {approved}
          </p>

          <p className="text-xs text-green-600 mt-1">
            Approved
          </p>

        </div>


        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

          <p className="text-2xl font-bold text-blue-600">
            {inReview}
          </p>

          <p className="text-xs text-blue-600 mt-1">
            In Review
          </p>

        </div>


        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

          <p className="text-2xl font-bold text-amber-600">
            {submitted}
          </p>

          <p className="text-xs text-amber-600 mt-1">
            Submitted
          </p>

        </div>


        <div className="rounded-xl border border-red-100 bg-red-50 p-4">

          <p className="text-2xl font-bold text-red-600">
            {rejected}
          </p>

          <p className="text-xs text-red-600 mt-1">
            Rejected
          </p>

        </div>

      </div>


      {/* Filters */}

      <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col sm:flex-row gap-3">


        <div className="relative flex-1">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            value={searchQuery}
            onChange={e =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search applications..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

        </div>


        <div className="flex items-center gap-2">

          <Filter className="w-4 h-4 text-slate-400" />

          <select
            value={filterStatus}
            onChange={e =>
              setFilterStatus(e.target.value)
            }
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
          >

            <option value="all">
              All Status
            </option>

            <option value="SUBMITTED">
              Submitted
            </option>

            <option value="IN_REVIEW">
              In Review
            </option>

            <option value="APPROVED">
              Approved
            </option>

            <option value="REJECTED">
              Rejected
            </option>

          </select>

        </div>

      </div>


      {/* No project */}

      {!project && (

        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">

          <FileTextIcon />

          <h3 className="font-semibold text-slate-800 mt-3">
            No project found
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Create a project before submitting applications.
          </p>

        </div>

      )}


      {/* No applications */}

      {project && applications.length === 0 && (

        <div className="bg-white rounded-xl border border-slate-100 p-10 text-center">

          <FileTextIcon />

          <h3 className="font-semibold text-slate-800 mt-3">
            No applications yet
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Applications submitted for this project will appear here.
          </p>

        </div>

      )}


      {/* Applications */}

      {applications.length > 0 && (

        <div className="grid lg:grid-cols-3 gap-6">


          {/* List */}

          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">

            <div className="p-4 border-b border-slate-100">

              <h3 className="font-semibold text-slate-900 text-sm">
                Applications
              </h3>

              <p className="text-xs text-slate-400 mt-0.5">
                {filteredApplications.length} records
              </p>

            </div>


            <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-50">

              {filteredApplications.map(application => {

                const Icon =
                  statusIcons[
                    application.status
                  ] || AlertTriangle

                const colors =
                  statusColors[
                    application.status
                  ] || statusColors.SUBMITTED


                return (

                  <button
                    key={application.id}
                    onClick={() =>
                      setSelectedApproval(
                        selectedApproval?.id === application.id
                          ? null
                          : application
                      )
                    }
                    className={`w-full text-left p-4 hover:bg-slate-50 ${
                      selectedApproval?.id === application.id
                        ? 'bg-primary-50'
                        : ''
                    }`}
                  >

                    <div className="flex gap-3">

                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor:
                            colors.bg,
                        }}
                      >

                        <Icon
                          className="w-4 h-4"
                          style={{
                            color:
                              colors.text,
                          }}
                        />

                      </div>


                      <div className="min-w-0">

                        <p className="text-sm font-medium text-slate-900 truncate">
                          {application.approvalName}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Application #{application.id}
                        </p>

                        <span
                          className="inline-flex mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor:
                              colors.bg,
                            color:
                              colors.text,
                          }}
                        >
                          {getStatusLabel(
                            application.status
                          )}
                        </span>

                      </div>

                    </div>

                  </button>

                )

              })}

            </div>

          </div>


          {/* Right */}

          <div className="lg:col-span-2 space-y-4">


            {/* Selected application */}

            {selectedApproval && (

              <div className="bg-white rounded-xl border border-slate-100 p-5">

                <div className="flex items-start justify-between">

                  <div>

                    <h3 className="font-semibold text-slate-900">
                      {selectedApproval.approvalName}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      Application #{selectedApproval.id}
                    </p>

                  </div>


                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor:
                        statusColors[
                          selectedApproval.status
                        ]?.bg,

                      color:
                        statusColors[
                          selectedApproval.status
                        ]?.text,
                    }}
                  >
                    {getStatusLabel(
                      selectedApproval.status
                    )}
                  </span>

                </div>


                <div className="grid sm:grid-cols-3 gap-3 mt-5">


                  <div className="p-3 rounded-lg bg-slate-50">

                    <p className="text-xs text-slate-500">
                      Submitted
                    </p>

                    <p className="text-sm font-semibold text-slate-900 mt-1">

                      {selectedApproval.submittedAt
                        ? new Date(
                            selectedApproval.submittedAt
                          ).toLocaleDateString()
                        : '—'}

                    </p>

                  </div>


                  <div className="p-3 rounded-lg bg-slate-50">

                    <p className="text-xs text-slate-500">
                      SLA Deadline
                    </p>

                    <p className="text-sm font-semibold text-slate-900 mt-1">

                      {selectedApproval.slaDeadline
                        ? new Date(
                            selectedApproval.slaDeadline
                          ).toLocaleDateString()
                        : '—'}

                    </p>

                  </div>


                  <div className="p-3 rounded-lg bg-slate-50">

                    <p className="text-xs text-slate-500">
                      Project
                    </p>

                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {project?.name || '—'}
                    </p>

                  </div>

                </div>


                {selectedApproval.remarks && (

                  <div className="mt-4 p-3 rounded-lg bg-slate-50">

                    <p className="text-xs text-slate-500">
                      Remarks
                    </p>

                    <p className="text-sm text-slate-700 mt-1">
                      {selectedApproval.remarks}
                    </p>

                  </div>

                )}

              </div>

            )}


            {/* Graph */}

            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">

              <div className="p-4 border-b border-slate-100 flex items-center justify-between">

                <div>

                  <h3 className="font-semibold text-slate-900 text-sm">
                    Application Flow
                  </h3>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Live applications from your project
                  </p>

                </div>

              </div>


              <div className="h-[450px]">

                {filteredApplications.length === 0 ? (

                  <div className="h-full flex items-center justify-center">

                    <p className="text-sm text-slate-400">
                      No applications match your filter.
                    </p>

                  </div>

                ) : (

                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    fitView
                    proOptions={{
                      hideAttribution: true,
                    }}
                    minZoom={0.3}
                    maxZoom={1.5}
                  >

                    <Background
                      color="#e2e8f0"
                      gap={20}
                      size={1}
                    />

                    <Controls />

                    <MiniMap
                      nodeStrokeColor={node =>
                        statusColors[
                          node.data?.status
                        ]?.border ||
                        '#cbd5e1'
                      }

                      nodeColor={node =>
                        statusColors[
                          node.data?.status
                        ]?.bg ||
                        '#f1f5f9'
                      }
                    />

                  </ReactFlow>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  )
}


/*
 * Small icon component so the page doesn't
 * need another dependency.
 */

function FileTextIcon() {

  return (

    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">

      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >

        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />

        <polyline points="14 2 14 8 20 8" />

        <line x1="16" y1="13" x2="8" y2="13" />

        <line x1="16" y1="17" x2="8" y2="17" />

        <polyline points="10 9 9 9 8 9" />

      </svg>

    </div>

  )
}