import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Building2,
  User,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [showPw, setShowPw] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    industry: '',
    state: '',
    designation: '',
    employeeCount: ''
  })

  const industries = [
    'Food Processing',
    'Pharmaceuticals',
    'Chemicals',
    'Textiles',
    'Automotive',
    'Electronics',
    'Others'
  ]

  const updateForm = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // STEP 1 → STEP 2
  const handleAccountSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setStep(2)
  }

  // STEP 2 → REGISTER USER → CREATE COMPANY → LOGIN
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // ------------------------------------------------
      // 1. CREATE USER
      // ------------------------------------------------
      console.log('Registering user...')

      const registerResponse = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password
      })

      console.log('User registration response:', registerResponse.data)

      const user = registerResponse.data

      if (!user.id) {
        throw new Error('User was created but no user ID was returned.')
      }

      // ------------------------------------------------
      // 2. CREATE COMPANY
      // ------------------------------------------------
      console.log('Creating company for user:', user.id)

      const companyResponse = await api.post(`/company/${user.id}`, {
        name: form.companyName,
        registrationNumber: `PENDING-${user.id}`,
        industryType: form.industry,
        address: form.state,
        contactEmail: form.email,
        contactPhone: ''
      })

      console.log('Company creation response:', companyResponse.data)

      // ------------------------------------------------
      // 3. LOGIN USER
      // ------------------------------------------------
      console.log('Logging in user...')

      await login(form.email, form.password)

      console.log('Registration completed successfully.')

      // ------------------------------------------------
      // 4. OPEN DASHBOARD
      // ------------------------------------------------
      navigate('/dashboard')

    } catch (error) {
      console.error('Registration failed:', error)

      let message = 'Registration failed. Please try again.'

      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          message = error.response.data
        } else if (error.response.data.message) {
          message = error.response.data.message
        }
      } else if (error.message) {
        message = error.message
      }

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-lg">

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>

            <h1 className="text-xl font-bold text-slate-900">
              Create Your Account
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Get started with your approval journey
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Steps */}
          <div className="flex items-center gap-2 mb-8">

            <div className="flex-1 flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                1
              </div>

              <span
                className={`text-xs font-medium hidden sm:inline ${
                  step >= 1
                    ? 'text-primary-600'
                    : 'text-slate-400'
                }`}
              >
                Account
              </span>

              <div
                className={`flex-1 h-0.5 ${
                  step >= 2
                    ? 'bg-primary-600'
                    : 'bg-slate-200'
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  step >= 2
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                2
              </div>

              <span
                className={`text-xs font-medium hidden sm:inline ${
                  step >= 2
                    ? 'text-primary-600'
                    : 'text-slate-400'
                }`}
              >
                Company
              </span>
            </div>

          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <form
              onSubmit={handleAccountSubmit}
              className="space-y-4"
            >

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    required
                    value={form.name}
                    onChange={e => updateForm('name', e.target.value)}
                    placeholder="Rajesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => updateForm('email', e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={form.password}
                    onChange={e => updateForm('password', e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPw
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Company Name
                </label>

                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    required
                    value={form.companyName}
                    onChange={e => updateForm('companyName', e.target.value)}
                    placeholder="Your Company Pvt. Ltd."
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Industry
                </label>

                <select
                  required
                  value={form.industry}
                  onChange={e => updateForm('industry', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select industry</option>

                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  State
                </label>

                <input
                  required
                  value={form.state}
                  onChange={e => updateForm('state', e.target.value)}
                  placeholder="e.g. Haryana"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Designation + Employees */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Designation
                  </label>

                  <input
                    required
                    value={form.designation}
                    onChange={e => updateForm('designation', e.target.value)}
                    placeholder="Director"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Employees
                  </label>

                  <input
                    required
                    type="number"
                    min="1"
                    value={form.employeeCount}
                    onChange={e => updateForm('employeeCount', e.target.value)}
                    placeholder="50"
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => {
                    setError('')
                    setStep(1)
                  }}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    'Creating...'
                  ) : (
                    <>
                      Create Account
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

              </div>

            </form>
          )}

          {/* Login link */}
          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}