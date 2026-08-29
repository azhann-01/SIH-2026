import { Link } from 'react-router-dom'

import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Clock,
  BarChart3,
  Users,
  FileSearch,
  Zap,
  Globe,
  Lock,
  TrendingUp,
  Route,
  MessageSquare,
  Lightbulb,
} from 'lucide-react'


export default function LandingPage() {
  return (
    <div className="min-h-screen">

      {/* Navigation */}

      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-16">

            <div className="flex items-center gap-2">

              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>

              <span className="font-bold text-slate-800 text-lg">
                e-Approvals
              </span>

            </div>


            <div className="hidden md:flex items-center gap-8">

              <a
                href="#features"
                className="text-sm text-slate-600 hover:text-primary-600 font-medium"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="text-sm text-slate-600 hover:text-primary-600 font-medium"
              >
                How It Works
              </a>

              <a
                href="#stats"
                className="text-sm text-slate-600 hover:text-primary-600 font-medium"
              >
                Impact
              </a>

            </div>


            <div className="flex items-center gap-3">

              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Get Started
              </Link>

            </div>

          </div>

        </div>

      </nav>


      {/* Hero */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900" />

        <div className="absolute inset-0 opacity-10">

          <svg width="100%" height="100%">

            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >

              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />

            </pattern>

            <rect
              width="100%"
              height="100%"
              fill="url(#grid)"
            />

          </svg>

        </div>


        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">

              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

              <span className="text-xs font-medium text-primary-200">
                Smart India Hackathon 2025
              </span>

            </div>


            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">

              Streamline Industrial Approvals,

              <br />

              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-green-300">
                Compliance & Government Services
              </span>

            </h1>


            <p className="mt-6 text-lg text-primary-200 leading-relaxed max-w-2xl">

              A unified, intelligent platform that generates customised
              approval checklists, guides applicants through documentation,
              pre-validates submissions, and provides a single dashboard
              for all applications, approvals, renewals, and incentives.

            </p>


            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg shadow-primary-900/30"
              >
                Start Your Application
                <ArrowRight className="w-4 h-4" />
              </Link>


              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-colors"
              >
                Sign In to Dashboard
              </Link>

            </div>

          </div>


          {/* Stats */}

          <div
            id="stats"
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >

            {[
              {
                label: 'Approval Types',
                value: '30+',
                icon: CheckCircle2,
              },
              {
                label: 'Industries Covered',
                value: '3 Core',
                icon: Globe,
              },
              {
                label: 'Avg. Processing Time',
                value: '4.2 Days',
                icon: Clock,
              },
              {
                label: 'SLA Compliance',
                value: '97.8%',
                icon: TrendingUp,
              },
            ].map(({ label, value, icon: Icon }) => (

              <div
                key={label}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >

                <Icon className="w-5 h-5 text-primary-300 mb-2" />

                <p className="text-2xl font-bold text-white">
                  {value}
                </p>

                <p className="text-xs text-primary-200 mt-0.5">
                  {label}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* Features */}

      <section
        id="features"
        className="py-20 bg-white"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">

            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Everything You Need for Industrial Approvals
            </h2>

            <p className="mt-3 text-slate-500 max-w-2xl mx-auto">
              From initial application to ongoing compliance, our platform
              covers the entire lifecycle of industrial approvals with
              AI-powered intelligence.
            </p>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {[
              {
                icon: FileSearch,
                title: 'Custom Approval Checklists',
                desc: 'AI-driven rules engine generates a tailored checklist based on your industry, location, and investment scale.',
              },

              {
                icon: Zap,
                title: 'Document Pre-validation',
                desc: 'Upload documents and get instant AI-powered validation. Extract data automatically from PDFs and detect mismatches.',
              },

              {
                icon: Route,
                title: 'Approval Roadmap',
                desc: 'Visual dependency graph showing all required approvals, their inter-dependencies, SLA timelines, and current status.',
              },

              {
                icon: MessageSquare,
                title: 'AI Regulatory Assistant',
                desc: 'Get answers about approval requirements, compliance deadlines, and documentation — all backed by official sources.',
              },

              {
                icon: BarChart3,
                title: 'Smart Dashboard',
                desc: 'Single-pane view of all applications, approvals, documents, compliance deadlines, and government schemes.',
              },

              {
                icon: Shield,
                title: 'Compliance Intelligence',
                desc: 'Automated tracking of renewals, audits, and regulatory filings with smart reminders and scheduling.',
              },

              {
                icon: Lightbulb,
                title: 'Government Schemes',
                desc: 'Discover applicable central and state schemes, check eligibility, and get step-by-step application guidance.',
              },

              {
                icon: Clock,
                title: 'SLA Tracking',
                desc: 'Real-time tracking of approval timelines with proactive alerts when SLAs are at risk of being breached.',
              },

              {
                icon: Users,
                title: 'Government Portal',
                desc: 'Dedicated analytics dashboard for government administrators to monitor bottlenecks and optimize processing.',
              },

            ].map(({ icon: Icon, title, desc }) => (

              <div
                key={title}
                className="group p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-primary-100 transition-all duration-200"
              >

                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">

                  <Icon className="w-5 h-5" />

                </div>


                <h3 className="font-semibold text-slate-900 mb-1.5">
                  {title}
                </h3>


                <p className="text-sm text-slate-500 leading-relaxed">
                  {desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* How It Works */}

      <section
        id="how-it-works"
        className="py-20 bg-slate-50"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">

            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              How It Works
            </h2>

            <p className="mt-3 text-slate-500">
              Three simple steps to streamline your industrial approval journey
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                step: '01',
                title: 'Create Profile & Project',
                desc: 'Register your company, create a project profile with industry, location, investment, and scale details.',
              },

              {
                step: '02',
                title: 'Get Intelligent Guidance',
                desc: 'Our rules engine generates your custom approval roadmap with dependencies, documents, timelines, and applicable schemes.',
              },

              {
                step: '03',
                title: 'Track & Manage',
                desc: 'Submit applications, upload documents, track SLA timelines, and stay compliant — all from one dashboard.',
              },

            ].map(({ step, title, desc }) => (

              <div
                key={step}
                className="relative"
              >

                <div className="text-6xl font-extrabold text-primary-100 mb-3">
                  {step}
                </div>

                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* Industries */}

      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">

            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Industries We Cover
            </h2>

            <p className="mt-3 text-slate-500">
              Starting with high-priority sectors — more industries added continuously
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {[
              {
                name: 'Food Processing',
                icon: '🍽️',
                approvals: '15+',
                color: 'from-green-500 to-emerald-600',
              },

              {
                name: 'Pharmaceuticals',
                icon: '💊',
                approvals: '20+',
                color: 'from-blue-500 to-indigo-600',
              },

              {
                name: 'Chemicals',
                icon: '⚗️',
                approvals: '18+',
                color: 'from-purple-500 to-violet-600',
              },

            ].map(({ name, icon, approvals, color }) => (

              <div
                key={name}
                className={`relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${color} text-white`}
              >

                <div className="text-4xl mb-4">
                  {icon}
                </div>

                <h3 className="text-xl font-bold mb-1">
                  {name}
                </h3>

                <p className="text-white/80 text-sm mb-4">
                  {approvals} approval types catalogued
                </p>

                <div className="flex items-center gap-1 text-sm font-medium text-white/90">

                  <span>
                    Explore approvals
                  </span>

                  <ArrowRight className="w-4 h-4" />

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="py-20 bg-gradient-to-br from-primary-900 to-slate-900">

        <div className="max-w-3xl mx-auto px-4 text-center">

          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Simplify Your Approvals?
          </h2>

          <p className="text-primary-200 mb-8">
            Join the platform that's transforming industrial approval
            management with AI-powered intelligence.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-colors shadow-lg"
          >
            Create Free Account
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>

      </section>


      {/* Footer */}

      <footer className="bg-slate-900 text-slate-400 py-10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            <div className="flex items-center gap-2">

              <div className="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center">

                <Shield className="w-4 h-4 text-white" />

              </div>

              <span className="font-semibold text-white text-sm">
                e-Approvals
              </span>

            </div>


            <p className="text-xs text-slate-500 text-center">
              Smart India Hackathon 2025 — SIH26130 |
              Industrial Approval & Compliance Intelligence Platform
            </p>


            <div className="flex items-center gap-4 text-xs">

              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Secure
              </span>

              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Verified
              </span>

            </div>

          </div>

        </div>

      </footer>

    </div>
  )
}