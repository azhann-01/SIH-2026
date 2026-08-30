import { useMemo, useState, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Users,
  FileText,
  Activity,
  MapPin,
  Download,
  RefreshCw
} from 'lucide-react'

import api from '../services/api'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'


/* =========================
   DEMO CHART DATA
   ========================= */

const monthlyData = [
  { month: 'Jul', applications: 42, approved: 28, pending: 8 },
  { month: 'Aug', applications: 38, approved: 25, pending: 10 },
  { month: 'Sep', applications: 55, approved: 35, pending: 12 },
  { month: 'Oct', applications: 48, approved: 32, pending: 9 },
  { month: 'Nov', applications: 62, approved: 41, pending: 14 },
  { month: 'Dec', applications: 45, approved: 30, pending: 8 },
  { month: 'Jan', applications: 34, approved: 23, pending: 7 },
]

const departmentData = [
  { name: 'Factories Dept.', value: 28 },
  { name: 'FSSAI', value: 22 },
  { name: 'PCB', value: 18 },
  { name: 'UHBVN', value: 12 },
  { name: 'MoEFCC', value: 8 },
  { name: 'Others', value: 12 },
]

const approvalTypeData = [
  { name: 'Factory License', value: 45 },
  { name: 'FSSAI', value: 32 },
  { name: 'Pollution NOC', value: 28 },
  { name: 'Electricity', value: 22 },
  { name: 'Env. Clearance', value: 15 },
  { name: 'Others', value: 14 },
]

const processingData = [
  { day: 'Mon', time: 4.1 },
  { day: 'Tue', time: 3.8 },
  { day: 'Wed', time: 5.2 },
  { day: 'Thu', time: 4.5 },
  { day: 'Fri', time: 3.9 },
  { day: 'Sat', time: 6.1 },
  { day: 'Sun', time: 2.8 },
]

const bottlenecks = [
  {
    name: 'Fire NOC',
    waiting: 12,
    avgDays: 18,
    slaDays: 10
  },
  {
    name: 'Pollution Control NOC',
    waiting: 10,
    avgDays: 15,
    slaDays: 12
  },
  {
    name: 'FSSAI License',
    waiting: 8,
    avgDays: 22,
    slaDays: 30
  },
  {
    name: 'Factory License',
    waiting: 5,
    avgDays: 8,
    slaDays: 10
  },
]

const PIE_COLORS = [
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#3b82f6',
  '#a855f7',
  '#ef4444',
  '#14b8a6'
]


/* =========================
   COMPONENT
   ========================= */

export default function GovernmentDashboard() {

  const [timeRange, setTimeRange] = useState('months')

  const [refreshing, setRefreshing] = useState(false)

  const [dataSource, setDataSource] = useState('loading')

  const [dashboardData, setDashboardData] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    activeApplicants: 0,
  })
  const [applications, setApplications] = useState([])
  const [applicationsLoading, setApplicationsLoading] = useState(true)
  const [applicationError, setApplicationError] = useState('')
  const [updatingApplication, setUpdatingApplication] = useState(null)


  /* =========================
     FETCH GOVERNMENT DASHBOARD
     ========================= */

  const fetchDashboardData = async () => {

    try {

      console.log('Fetching government dashboard...')

      const response = await api.get('/dashboard/government')

      console.log(
        'Government dashboard response:',
        response.data
      )

      setDashboardData({
        totalApplications: response.data.totalApplications ?? 0,
        pending: response.data.pending ?? 0,
        approved: response.data.approved ?? 0,
        rejected: response.data.rejected ?? 0,
        activeApplicants: response.data.activeApplicants ?? 0,
      })

      setDataSource('live')

    } catch (error) {

      console.error(
        'Failed to fetch government dashboard:',
        error
      )

      setDataSource('error')

    }
  }
  const fetchApplications = async () => {
  try {
    setApplicationsLoading(true)
    setApplicationError('')

    const response = await api.get('/application/all')

    setApplications(response.data || [])
  } catch (error) {
    console.error('Failed to fetch applications:', error)
    setApplicationError('Unable to load applications.')
  } finally {
    setApplicationsLoading(false)
  }
}

const updateApplicationStatus = async (id, status) => {
  try {
    setUpdatingApplication(id)
    setApplicationError('')

    await api.patch(
      `/application/${id}/status`,
      null,
      {
        params: { status }
      }
    )

    await fetchApplications()
    await fetchDashboardData()
  } catch (error) {
    console.error('Failed to update application:', error)

    setApplicationError(
      error.response?.data ||
      'Unable to update application status.'
    )
  } finally {
    setUpdatingApplication(null)
  }
}


  /* =========================
     INITIAL LOAD
     ========================= */

  useEffect(() => {

    fetchDashboardData()
    fetchApplications()

  }, [])


  /* =========================
     REFRESH BUTTON
     ========================= */

  const handleRefresh = async () => {

    setRefreshing(true)

    try {

      await fetchDashboardData()

    } finally {

      setRefreshing(false)

    }
  }


  /* =========================
     EXPORT
     ========================= */

  const handleExport = () => {

    const rows = [
      [
        'Approval Type',
        'Waiting Applications',
        'Average Processing Days',
        'Expected SLA Days',
        'Variance %',
        'Status'
      ],

      ...bottlenecks.map(item => {

        const variance =
          ((item.avgDays - item.slaDays) /
            item.slaDays) * 100

        const status =
          variance > 20
            ? 'Critical'
            : variance > 0
              ? 'At Risk'
              : 'On Track'

        return [
          item.name,
          item.waiting,
          item.avgDays,
          item.slaDays,
          `${variance.toFixed(0)}%`,
          status
        ]
      })
    ]

    const csv = rows
      .map(row =>
        row
          .map(value =>
            `"${String(value).replaceAll('"', '""')}"`
          )
          .join(',')
      )
      .join('\n')

    const blob = new Blob(
      [csv],
      {
        type: 'text/csv;charset=utf-8;'
      }
    )

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = url

    link.download =
      'government-bottleneck-report.csv'

    link.click()

    URL.revokeObjectURL(url)
  }


  /* =========================
     BOTTLENECK PROCESSING
     ========================= */

  const processedBottlenecks = useMemo(
    () => bottlenecks.map(item => {

      const variance =
        ((item.avgDays - item.slaDays) /
          item.slaDays) * 100

      const status =
        variance > 20
          ? 'critical'
          : variance > 0
            ? 'warning'
            : 'good'

      return {
        ...item,
        variance:
          `${variance >= 0 ? '+' : ''}${variance.toFixed(0)}%`,
        status
      }
    }),
    []
  )


  const biggestBottleneck =
    [...processedBottlenecks]
      .sort((a, b) => {

        const aVariance =
          parseFloat(a.variance)

        const bVariance =
          parseFloat(b.variance)

        return (
          (bVariance + b.waiting) -
          (aVariance + a.waiting)
        )
      })[0]


  /* =========================
     STAT CARDS
     ========================= */

  const statCards = [

    {
      label: 'Total Applications',
      value: dashboardData.totalApplications,
      change: 'Live',
      up: true,
      icon: FileText,
      color: 'text-primary-600 bg-primary-50'
    },

    {
      label: 'Pending Review',
      value: dashboardData.pending,
      change: 'Live',
      up: false,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50'
    },

    {
      label: 'High Risk Cases',
      value: '—',
      change: 'Not available',
      up: false,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-50'
    },

    {
      label: 'SLA Breaches',
      value: '—',
      change: 'Not available',
      up: false,
      icon: XCircle,
      color: 'text-red-600 bg-red-50'
    },

    {
      label: 'Approved',
      value: dashboardData.approved,
      change: 'Live',
      up: true,
      icon: CheckCircle2,
      color: 'text-green-600 bg-green-50'
    },

    {
      label: 'Rejected',
      value: dashboardData.rejected,
      change: 'Live',
      up: false,
      icon: XCircle,
      color: 'text-slate-600 bg-slate-100'
    },

  ]


  /* =========================
     APPROVAL RATE
     ========================= */

  const approvalRate =
    dashboardData.totalApplications > 0
      ? Math.round(
          (
            dashboardData.approved /
            dashboardData.totalApplications
          ) * 100
        )
      : 0


  /* =========================
     UI
     ========================= */

  return (

    <div className="space-y-6">


      {/* =========================
          HEADER
          ========================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            Government Dashboard
          </h1>

          <p className="text-sm text-slate-500 mt-0.5">
            Monitor industrial approvals, processing metrics,
            and system analytics
          </p>

          <span className="inline-flex mt-2 items-center gap-1.5 text-[11px] font-medium text-slate-500">

            <span
              className={`w-1.5 h-1.5 rounded-full ${
                dataSource === 'live'
                  ? 'bg-green-500'
                  : dataSource === 'error'
                    ? 'bg-red-500'
                    : 'bg-amber-500'
              }`}
            />

            {dataSource === 'live'
              ? 'Live data'
              : dataSource === 'error'
                ? 'Unable to load live data'
                : 'Loading data...'}

            {' · Updated just now'}

          </span>

        </div>


        <div className="flex items-center gap-3">

          <select
            value={timeRange}
            onChange={e =>
              setTimeRange(e.target.value)
            }
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
          >

            <option value="months">
              Last 7 Months
            </option>

            <option value="week">
              This Week
            </option>

            <option value="quarter">
              This Quarter
            </option>

            <option value="year">
              This Year
            </option>

          </select>


          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
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


          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >

            <Download className="w-4 h-4" />

            Export

          </button>

        </div>

      </div>



      {/* =========================
          LIVE STAT CARDS
          ========================= */}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

        {statCards.map(
          ({
            label,
            value,
            change,
            up,
            icon: Icon,
            color
          }) => (

            <div
              key={label}
              className="bg-white rounded-xl border border-slate-100 p-4"
            >

              <div
                className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-3`}
              >

                <Icon className="w-4 h-4" />

              </div>


              <p className="text-xl font-bold text-slate-900">
                {value}
              </p>


              <div className="flex items-center gap-1 mt-1">

                {up ? (

                  <TrendingUp className="w-3 h-3 text-green-500" />

                ) : (

                  <TrendingDown className="w-3 h-3 text-red-500" />

                )}

                <span
                  className={`text-xs font-medium ${
                    change === 'Live'
                      ? 'text-green-600'
                      : 'text-slate-400'
                  }`}
                >
                  {change}
                </span>

              </div>


              <p className="text-xs text-slate-500 mt-0.5">
                {label}
              </p>

            </div>

          )
        )}

      </div>



      {/* =========================
          KPI ROW
          ========================= */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">


        {/* Average Processing */}

        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">

            <Activity className="w-5 h-5" />

          </div>

          <div>

            <p className="text-xs text-slate-500">
              Avg Processing
            </p>

            <p className="text-lg font-bold text-slate-900">
              4.2 days
            </p>

            <p className="text-[10px] text-slate-400">
              Demo metric
            </p>

          </div>

        </div>


        {/* Approval Rate */}

        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">

            <CheckCircle2 className="w-5 h-5" />

          </div>

          <div>

            <p className="text-xs text-slate-500">
              Approval Rate
            </p>

            <p className="text-lg font-bold text-slate-900">
              {approvalRate}%
            </p>

            <p className="text-[10px] text-green-600">
              Live calculation
            </p>

          </div>

        </div>


        {/* Active Applicants */}

        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">

            <Users className="w-5 h-5" />

          </div>

          <div>

            <p className="text-xs text-slate-500">
              Active Applicants
            </p>

            <p className="text-lg font-bold text-slate-900">
              {dashboardData.activeApplicants}
            </p>

            <p className="text-[10px] text-green-600">
              Live data
            </p>

          </div>

        </div>


        {/* Districts */}

        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">

            <MapPin className="w-5 h-5" />

          </div>

          <div>

            <p className="text-xs text-slate-500">
              Districts Covered
            </p>

            <p className="text-lg font-bold text-slate-900">
              22
            </p>

            <p className="text-[10px] text-slate-400">
              Demo metric
            </p>

          </div>

        </div>

      </div>



      {/* =========================
          CHARTS ROW
          ========================= */}

      <div className="grid lg:grid-cols-3 gap-6">


        {/* Monthly Trend */}

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5">

          <h3 className="font-semibold text-slate-900 mb-4">
            Application & Approval Trend
          </h3>

          <div className="h-[300px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={monthlyData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="month"
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0'
                  }}
                />

                <Bar
                  dataKey="applications"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />

                <Bar
                  dataKey="approved"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                />

                <Bar
                  dataKey="pending"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* Approval Types */}

        <div className="bg-white rounded-xl border border-slate-100 p-5">

          <h3 className="font-semibold text-slate-900 mb-4">
            Approval Type Distribution
          </h3>

          <div className="h-[250px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={approvalTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  paddingAngle={3}
                >

                  {approvalTypeData.map(
                    (_, index) => (

                      <Cell
                        key={index}
                        fill={
                          PIE_COLORS[
                            index %
                            PIE_COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>



      {/* =========================
          SECOND CHART ROW
          ========================= */}

      <div className="grid lg:grid-cols-3 gap-6">


        {/* Processing Time */}

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5">

          <h3 className="font-semibold text-slate-900 mb-1">
            Processing Time (Days) — Weekly Average
          </h3>

          <p className="text-xs text-slate-400 mb-4">
            Target: ≤ 5 days
          </p>

          <div className="h-[220px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={processingData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                />

                <XAxis
                  dataKey="day"
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 8]}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="time"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{
                    fill: '#6366f1',
                    r: 4
                  }}
                  activeDot={{
                    r: 6
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* Department */}

        <div className="bg-white rounded-xl border border-slate-100 p-5">

          <h3 className="font-semibold text-slate-900 mb-4">
            By Department
          </h3>

          <div className="h-[220px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={departmentData}
                layout="vertical"
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                />

                <XAxis
                  type="number"
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fill: '#64748b'
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#6366f1"
                  radius={[0, 4, 4, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>



      {/* =========================
          BOTTLENECK DETECTION
          ========================= */}

      <div className="bg-white rounded-xl border border-slate-100">


        <div className="p-5 border-b border-slate-100">

          <h3 className="font-semibold text-slate-900 flex items-center gap-2">

            <AlertTriangle className="w-4 h-4 text-amber-500" />

            Bottleneck Detection

          </h3>

          <p className="text-xs text-slate-400 mt-0.5">
            Identify approval types causing delays in the pipeline
          </p>

        </div>


        <div className="px-5 py-4 bg-amber-50/50 border-b border-slate-100">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                Current Biggest Bottleneck
              </p>

              <p className="text-base font-bold text-slate-900 mt-1">
                {biggestBottleneck.name}
              </p>

              <p className="text-sm text-slate-600 mt-0.5">
                {biggestBottleneck.waiting}
                {' '}applications waiting ·{' '}
                {biggestBottleneck.avgDays}
                {' '}days average processing ·{' '}
                {biggestBottleneck.variance}
                {' '}vs SLA
              </p>

            </div>


            <span className="inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">

              <AlertTriangle className="w-3 h-3" />

              Needs Attention

            </span>

          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="bg-slate-50">

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Approval Type
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Waiting
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Avg Time
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Expected SLA
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Variance
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-slate-50">

              {processedBottlenecks.map(item => (

                <tr
                  key={item.name}
                  className="hover:bg-slate-50/50"
                >

                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    {item.name}
                  </td>

                  <td className="px-5 py-3.5 text-slate-600">
                    {item.waiting} applications
                  </td>

                  <td className="px-5 py-3.5 text-slate-600">
                    {item.avgDays} days
                  </td>

                  <td className="px-5 py-3.5 text-slate-600">
                    {item.slaDays} days
                  </td>

                  <td className="px-5 py-3.5">

                    <span
                      className={`font-medium ${
                        parseFloat(item.variance) > 0
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {item.variance}
                    </span>

                  </td>

                  <td className="px-5 py-3.5">

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        item.status === 'critical'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : item.status === 'warning'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-green-50 text-green-700 border-green-200'
                      }`}
                    >

                      {item.status === 'critical'
                        ? <AlertTriangle className="w-3 h-3" />
                        : item.status === 'warning'
                          ? <Clock className="w-3 h-3" />
                          : <CheckCircle2 className="w-3 h-3" />
                      }

                      {item.status === 'critical'
                        ? 'Critical'
                        : item.status === 'warning'
                          ? 'At Risk'
                          : 'On Track'
                      }

                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
                    {/* =========================
          APPLICATIONS FOR REVIEW
          ========================= */}

      <div className="bg-white rounded-xl border border-slate-100">

        <div className="p-5 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">
            Applications for Review
          </h3>

          <p className="text-xs text-slate-400 mt-0.5">
            Review and process submitted approval applications
          </p>
        </div>

        {applicationError && (
          <div className="mx-5 mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
            {applicationError}
          </div>
        )}

        {applicationsLoading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="bg-slate-50">

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Application
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Project
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Approval
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Status
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Submitted
                  </th>

                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">

                {applications.map((application) => (

                  <tr
                    key={application.id}
                    className="hover:bg-slate-50/50"
                  >

                    <td className="px-5 py-4 font-medium text-slate-900">
                      #{application.id}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      #{application.projectId}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {application.approvalName}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          application.status === 'APPROVED'
                            ? 'bg-green-50 text-green-700'
                            : application.status === 'REJECTED'
                              ? 'bg-red-50 text-red-700'
                              : application.status === 'IN_REVIEW'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {application.status}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {application.submittedAt
                        ? new Date(
                            application.submittedAt
                          ).toLocaleDateString()
                        : '—'}
                    </td>

                    <td className="px-5 py-4">

                      <div className="flex flex-wrap gap-2">

                        {application.status === 'SUBMITTED' && (
                          <button
                            onClick={() =>
                              updateApplicationStatus(
                                application.id,
                                'IN_REVIEW'
                              )
                            }
                            disabled={
                              updatingApplication === application.id
                            }
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                          >
                            In Review
                          </button>
                        )}

                        {(application.status === 'SUBMITTED' ||
                          application.status === 'IN_REVIEW') && (
                          <>
                            <button
                              onClick={() =>
                                updateApplicationStatus(
                                  application.id,
                                  'APPROVED'
                                )
                              }
                              disabled={
                                updatingApplication === application.id
                              }
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50"
                            >
                              Approve
                            </button>

                            <button
                              onClick={() =>
                                updateApplicationStatus(
                                  application.id,
                                  'REJECTED'
                                )
                              }
                              disabled={
                                updatingApplication === application.id
                              }
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {(application.status === 'APPROVED' ||
                          application.status === 'REJECTED') && (
                          <span className="text-xs text-slate-400">
                            Processed
                          </span>
                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>
      
    </div>
  )
}