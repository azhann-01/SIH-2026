import { useState, useMemo } from 'react'
import { mockApprovals, statusColors, statusLabels } from '../data/mockData'

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
} from 'lucide-react'


const statusIcons = {
  approved: CheckCircle2,
  in_progress: Clock,
  pending: AlertTriangle,
  rejected: XCircle,
}


const statusNodeColors = {
  approved: {
    bg: '#dcfce7',
    border: '#22c55e',
    text: '#15803d',
  },

  in_progress: {
    bg: '#dbeafe',
    border: '#3b82f6',
    text: '#1d4ed8',
  },

  pending: {
    bg: '#fef3c7',
    border: '#f59e0b',
    text: '#92400e',
  },

  not_started: {
    bg: '#f1f5f9',
    border: '#94a3b8',
    text: '#475569',
  },
}


function ApprovalNode({ data }) {
  const colors =
    statusNodeColors[data.status] || statusNodeColors.pending

  const Icon =
    statusIcons[data.status] || AlertTriangle

  return (
    <div
      className="bg-white rounded-xl shadow-lg border-2 min-w-[220px]"
      style={{ borderColor: colors.border }}
    >
      {/* Header */}
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
            {data.approval}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-xs text-slate-500 mb-2">
          {data.department}
        </p>

        <div className="flex flex-wrap gap-1.5">

          {/* SLA */}
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
            {data.sla}
          </span>

          {/* Risk */}
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
              data.riskFactors === 'High'
                ? 'bg-red-50 text-red-600'
                : data.riskFactors === 'Medium'
                ? 'bg-amber-50 text-amber-600'
                : 'bg-green-50 text-green-600'
            }`}
          >
            {data.riskFactors} Risk
          </span>

          {/* Processing Stage */}
          <span className="text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full font-medium">
            {data.processingStage}
          </span>
        </div>

        {/* Dependencies */}
        {data.dependencies &&
          data.dependencies.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">
                Depends on
              </p>

              {data.dependencies.map((dep, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded mr-1 mb-0.5 inline-block border border-amber-100"
                >
                  {dep}
                </span>
              ))}
            </div>
          )}
      </div>

      {/* React Flow Handles */}
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
  const [selectedApproval, setSelectedApproval] =
    useState(null)

  const [filterStatus, setFilterStatus] =
    useState('all')

  const [searchQuery, setSearchQuery] =
    useState('')


  /* -----------------------------
     Filter Approvals
  ----------------------------- */

  const filteredApprovals = useMemo(() => {
    return mockApprovals.filter((a) => {

      if (
        filterStatus !== 'all' &&
        a.status !== filterStatus
      ) {
        return false
      }

      if (
        searchQuery &&
        !a.approval
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) &&
        !a.department
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }, [filterStatus, searchQuery])


  /* -----------------------------
     Build React Flow Nodes + Edges
  ----------------------------- */

  const { nodes, edges } = useMemo(() => {

    const approvalNodes =
      filteredApprovals.map((approval, index) => {

        const cols = 3

        const row = Math.floor(index / cols)
        const col = index % cols

        const x = 100 + col * 300
        const y = row * 280

        return {
          id: String(approval.id),

          type: 'approvalNode',

          position: {
            x,
            y,
          },

          data: approval,
        }
      })


    const flowEdges = []


    filteredApprovals.forEach((approval) => {

      if (!approval.dependencies) {
        return
      }

      approval.dependencies.forEach((depName) => {

        const depApproval =
          filteredApprovals.find(
            (a) => a.approval === depName
          )

        if (depApproval) {

          const isInProgress =
            approval.status === 'in_progress'

          flowEdges.push({
            id: `${depApproval.id}-${approval.id}`,

            source: String(depApproval.id),

            target: String(approval.id),

            type: 'smoothstep',

            animated: isInProgress,

            style: {
              stroke: isInProgress
                ? '#6366f1'
                : '#cbd5e1',

              strokeWidth: 2,
            },

            markerEnd: {
              type: MarkerType.ArrowClosed,

              color: isInProgress
                ? '#6366f1'
                : '#cbd5e1',
            },
          })
        }
      })
    })


    return {
      nodes: approvalNodes,
      edges: flowEdges,
    }

  }, [filteredApprovals])


  /* -----------------------------
     Overview Statistics
  ----------------------------- */

  const overviewStats = {
    total: mockApprovals.length,

    approved: mockApprovals.filter(
      (a) => a.status === 'approved'
    ).length,

    inProgress: mockApprovals.filter(
      (a) => a.status === 'in_progress'
    ).length,

    pending: mockApprovals.filter(
      (a) => a.status === 'pending'
    ).length,
  }


  /* -----------------------------
     UI
  ----------------------------- */

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Approval Roadmap
        </h1>

        <p className="text-sm text-slate-500 mt-0.5">
          Visualize all approvals, dependencies, and
          timelines for your projects
        </p>
      </div>


      {/* Overview Stats */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {[
          {
            label: 'Total Approvals',
            value: overviewStats.total,
            color:
              'bg-primary-50 text-primary-600 border-primary-100',
          },

          {
            label: 'Approved',
            value: overviewStats.approved,
            color:
              'bg-green-50 text-green-600 border-green-100',
          },

          {
            label: 'In Progress',
            value: overviewStats.inProgress,
            color:
              'bg-blue-50 text-blue-600 border-blue-100',
          },

          {
            label: 'Pending',
            value: overviewStats.pending,
            color:
              'bg-amber-50 text-amber-600 border-amber-100',
          },
        ].map(({ label, value, color }) => (

          <div
            key={label}
            className={`rounded-xl border p-4 ${color}`}
          >
            <p className="text-2xl font-bold">
              {value}
            </p>

            <p className="text-xs font-medium opacity-70 mt-0.5">
              {label}
            </p>
          </div>

        ))}
      </div>


      {/* Filters */}

      <div className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col sm:flex-row gap-3">

        {/* Search */}

        <div className="relative flex-1">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

          <input
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search approvals or departments..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />

        </div>


        {/* Status Filter */}

        <div className="flex items-center gap-2">

          <Filter className="w-4 h-4 text-slate-400 shrink-0" />

          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value)
            }
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">
              All Status
            </option>

            <option value="approved">
              Approved
            </option>

            <option value="in_progress">
              In Progress
            </option>

            <option value="pending">
              Pending
            </option>
          </select>

        </div>

      </div>


      {/* Approval List + Flow */}

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Approval List */}

        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-100 overflow-hidden">

          <div className="p-4 border-b border-slate-100">

            <h3 className="font-semibold text-slate-900 text-sm">
              All Approvals
            </h3>

            <p className="text-xs text-slate-400 mt-0.5">
              {filteredApprovals.length} records
            </p>

          </div>


          <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-50">

            {filteredApprovals.map((approval) => {

              const StatusIcon =
                statusIcons[approval.status] ||
                AlertTriangle

              return (

                <button
                  key={approval.id}
                  onClick={() =>
                    setSelectedApproval(
                      selectedApproval?.id === approval.id
                        ? null
                        : approval
                    )
                  }
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors ${
                    selectedApproval?.id === approval.id
                      ? 'bg-primary-50'
                      : ''
                  }`}
                >

                  <div className="flex items-start gap-3">

                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        approval.status === 'approved'
                          ? 'bg-green-100'
                          : approval.status ===
                            'in_progress'
                          ? 'bg-blue-100'
                          : 'bg-amber-100'
                      }`}
                    >

                      <StatusIcon
                        className={`w-4 h-4 ${
                          approval.status === 'approved'
                            ? 'text-green-600'
                            : approval.status ===
                              'in_progress'
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        }`}
                      />

                    </div>


                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-medium text-slate-900 truncate">
                        {approval.approval}
                      </p>

                      <p className="text-xs text-slate-500 mt-0.5">
                        {approval.department}
                      </p>


                      <div className="flex items-center gap-2 mt-2">

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                            statusColors[
                              approval.status
                            ] || ''
                          }`}
                        >
                          {statusLabels[
                            approval.status
                          ] || approval.status}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {approval.sla}
                        </span>

                      </div>

                    </div>

                  </div>

                </button>

              )
            })}

          </div>

        </div>


        {/* Details + Graph */}

        <div className="lg:col-span-2 space-y-4">

          {/* Selected Approval */}

          {selectedApproval && (

            <div className="bg-white rounded-xl border border-slate-100 p-5">

              <div className="flex items-start justify-between mb-4">

                <div>

                  <h3 className="font-semibold text-slate-900">
                    {selectedApproval.approval}
                  </h3>

                  <p className="text-sm text-slate-500 mt-0.5">
                    {selectedApproval.department}
                  </p>

                </div>


                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                    statusColors[
                      selectedApproval.status
                    ] || ''
                  }`}
                >
                  {statusLabels[
                    selectedApproval.status
                  ] || selectedApproval.status}
                </span>

              </div>


              {/* Summary */}

              <div className="grid sm:grid-cols-3 gap-3 mb-5">

                <div className="p-3 rounded-lg bg-slate-50">

                  <p className="text-xs text-slate-500">
                    SLA Timeline
                  </p>

                  <p className="text-sm font-semibold text-slate-900">
                    {selectedApproval.sla}
                  </p>

                </div>


                <div className="p-3 rounded-lg bg-slate-50">

                  <p className="text-xs text-slate-500">
                    Risk Level
                  </p>

                  <p
                    className={`text-sm font-semibold ${
                      selectedApproval.riskFactors ===
                      'High'
                        ? 'text-red-600'
                        : selectedApproval.riskFactors ===
                          'Medium'
                        ? 'text-amber-600'
                        : 'text-green-600'
                    }`}
                  >
                    {selectedApproval.riskFactors}
                  </p>

                </div>


                <div className="p-3 rounded-lg bg-slate-50">

                  <p className="text-xs text-slate-500">
                    Renewal
                  </p>

                  <p className="text-sm font-semibold text-slate-900">
                    {selectedApproval.renewal}
                  </p>

                </div>

              </div>


              {/* Timeline */}

              <div>

                <h4 className="text-sm font-semibold text-slate-700 mb-3">
                  Processing Timeline
                </h4>


                <div className="relative">

                  {selectedApproval.timeline?.map(
                    (item, i) => (

                      <div
                        key={i}
                        className="flex gap-3 pb-4 last:pb-0"
                      >

                        <div className="flex flex-col items-center">

                          <div
                            className={`w-3 h-3 rounded-full border-2 ${
                              item.status ===
                              'completed'
                                ? 'bg-green-500 border-green-500'
                                : item.status ===
                                  'in_progress'
                                ? 'bg-blue-500 border-blue-500 animate-pulse'
                                : 'bg-slate-200 border-slate-300'
                            }`}
                          />

                          {i <
                            selectedApproval.timeline
                              .length -
                              1 && (

                            <div
                              className={`w-0.5 h-8 ${
                                item.status ===
                                'completed'
                                  ? 'bg-green-300'
                                  : 'bg-slate-200'
                              }`}
                            />

                          )}

                        </div>


                        <div className="flex-1">

                          <p className="text-sm font-medium text-slate-700">
                            {item.stage}
                          </p>

                          <p className="text-xs text-slate-400 mt-0.5">
                            {item.date}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          )}


          {/* Dependency Graph */}

          <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">

            <div className="p-4 border-b border-slate-100 flex items-center justify-between">

              <h3 className="font-semibold text-slate-900 text-sm">
                Approval Dependency Graph
              </h3>


              <div className="flex items-center gap-3 text-xs">

                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  Approved
                </span>

                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  In Progress
                </span>

                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Pending
                </span>

              </div>

            </div>


            {/* React Flow */}

            <div className="h-[400px]">

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

                <Controls
                  className="!bg-white !border-slate-200 !shadow-lg"
                />

                <MiniMap
                  nodeStrokeColor={(n) =>
                    statusNodeColors[
                      n.data?.status
                    ]?.border || '#cbd5e1'
                  }

                  nodeColor={(n) =>
                    statusNodeColors[
                      n.data?.status
                    ]?.bg || '#f1f5f9'
                  }

                  className="!bg-white !rounded-lg !shadow-lg"
                />

              </ReactFlow>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}