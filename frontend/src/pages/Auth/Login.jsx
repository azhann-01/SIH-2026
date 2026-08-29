import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Shield,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight
} from 'lucide-react'

import { useAuth } from '../../context/AuthContext'

export default function Login() {

  const { login } = useAuth()
  const navigate = useNavigate()

  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {

    e.preventDefault()

    setLoading(true)
    setError('')

    try {

      // Login and get user data
      const data = await login(
        form.email,
        form.password
      )

      console.log('Logged in user:', data)

      // =========================
      // ROLE BASED REDIRECT
      // =========================

      if (data.role === 'GOVERNMENT_OFFICIAL') {

        navigate('/government-dashboard')

      } else {

        // APPLICANT
        navigate('/dashboard')

      }

    } catch (error) {

      console.error('Login failed:', error)

      setError(
        error.response?.data ||
        error.message ||
        'Invalid email or password'
      )

    } finally {

      setLoading(false)

    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">

          {/* HEADER */}

          <div className="text-center mb-8">

            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mx-auto mb-4">

              <Shield className="w-6 h-6 text-white" />

            </div>

            <h1 className="text-xl font-bold text-slate-900">
              Welcome back
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Sign in to your approval portal
            </p>

          </div>


          {/* ERROR */}

          {error && (

            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-700">

              {error}

            </div>

          )}


          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* EMAIL */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value
                    })
                  }
                  placeholder="you@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />

              </div>

            </div>


            {/* PASSWORD */}

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
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value
                    })
                  }
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />

                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >

                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}

                </button>

              </div>

            </div>


            {/* OPTIONS */}

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 cursor-pointer">

                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />

                <span className="text-slate-600">
                  Remember me
                </span>

              </label>

              <a
                href="#"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot password?
              </a>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >

              {loading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}

            </button>

          </form>


          {/* REGISTER */}

          <div className="mt-6 text-center text-sm text-slate-500">

            Don't have an account?{' '}

            <Link
              to="/register"
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              Create one
            </Link>

          </div>


          {/* DEMO */}

          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100">

            <p className="text-xs text-slate-400 text-center">

              Demo: Use any email to sign in, or try{' '}

              <code className="bg-slate-200 px-1 rounded">
                admin@eapprovals.gov
              </code>{' '}

              for government role

            </p>

          </div>

        </div>

      </div>

    </div>
  )
}