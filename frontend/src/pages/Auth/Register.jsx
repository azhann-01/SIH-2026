import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, Mail, Lock, Building2, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPw, setShowPw] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    companyName: '', industry: '', state: '',
    designation: '', employeeCount: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    login({ id: 1, name: form.name, email: form.email, role: 'investor' })
    navigate('/dashboard')
  }

  const industries = ['Food Processing', 'Pharmaceuticals', 'Chemicals', 'Textiles', 'Automotive', 'Electronics', 'Others']

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Create Your Account</h1>
            <p className="text-sm text-slate-500 mt-1">Get started with your approval journey</p>
          </div>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${s <= step ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {s}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${s <= step ? 'text-primary-600' : 'text-slate-400'}`}>
                  {s === 1 ? 'Account' : 'Company'}
                </span>
                {s < 2 && <div className={`flex-1 h-0.5 ${s < step ? 'bg-primary-600' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={step === 1 ? () => setStep(2) : handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rajesh Kumar" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="Your Company Pvt. Ltd." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                  <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select industry</option>
                    {industries.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                  <input required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="e.g., Haryana" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Designation</label>
                    <input required value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} placeholder="e.g., Director" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Employees</label>
                    <input required value={form.employeeCount} onChange={e => setForm({ ...form, employeeCount: e.target.value })} placeholder="e.g., 50" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-2">
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">
                  Back
                </button>
              )}
              <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                {step === 1 ? <>Continue <ArrowRight className="w-4 h-4" /></> : <>Create Account <CheckCircle2 className="w-4 h-4" /></>}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}