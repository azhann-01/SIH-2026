import { useState } from 'react'

import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Edit2,
  Save,
  X,
  TrendingUp,
} from 'lucide-react'

import { mockCompany } from '../data/mockData'


export default function CompanyProfile() {
  const [editing, setEditing] = useState(false)

  const [company, setCompany] = useState(mockCompany)


  const updateField = (field, value) => {
    setCompany({
      ...company,
      [field]: value,
    })
  }


  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Company Profile
          </h1>

          <p className="text-sm text-slate-500 mt-0.5">
            Manage your company information
          </p>
        </div>


        {!editing ? (

          <button
            onClick={() => setEditing(true)}
            className="inline-flex items-center gap-1.5 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>

        ) : (

          <div className="flex gap-2">

            <button
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>


            <button
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              Save
            </button>

          </div>

        )}

      </div>


      {/* Header Card */}

      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">

        <div className="h-24 bg-gradient-to-r from-primary-600 to-primary-700" />


        <div className="px-6 pb-6">

          <div className="flex items-end -mt-10 mb-4">

            <div className="w-20 h-20 rounded-xl bg-primary-600 flex items-center justify-center border-4 border-white shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>


            <div className="ml-4 mb-1">

              {editing ? (

                <input
                  value={company.name}
                  onChange={(e) =>
                    updateField('name', e.target.value)
                  }
                  className="text-lg font-bold text-slate-900 border border-primary-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />

              ) : (

                <h2 className="text-lg font-bold text-slate-900">
                  {company.name}
                </h2>

              )}

              <span className="inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                Active
              </span>

            </div>

          </div>


          {/* Company Information */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {[
              {
                label: 'Company Type',
                field: 'type',
                icon: Building2,
                value: company.type,
              },

              {
                label: 'Industry',
                field: 'industry',
                icon: Building2,
                value: company.industry,
              },

              {
                label: 'PAN Number',
                field: 'pan',
                icon: CreditCard,
                value: company.pan,
              },

              {
                label: 'CIN',
                field: 'cin',
                icon: CreditCard,
                value: company.cin,
              },

              {
                label: 'GSTIN',
                field: 'gst',
                icon: CreditCard,
                value: company.gst,
              },

              {
                label: 'Contact Person',
                field: 'contactPerson',
                icon: Users,
                value: company.contactPerson,
              },

              {
                label: 'Contact Email',
                field: 'contactEmail',
                icon: Mail,
                value: company.contactEmail,
              },

              {
                label: 'Contact Phone',
                field: 'contactPhone',
                icon: Phone,
                value: company.contactPhone,
              },

              {
                label: 'Address',
                field: 'address',
                icon: MapPin,
                value: company.address,
              },

              {
                label: 'Incorporation Date',
                field: 'incorporationDate',
                icon: Calendar,
                value: company.incorporationDate,
              },

              {
                label: 'Employee Count',
                field: 'employeeCount',
                icon: Users,
                value: company.employeeCount,
              },

              {
                label: 'Annual Turnover',
                field: 'annualTurnover',
                icon: TrendingUp,
                value: company.annualTurnover,
              },

            ].map(({ label, field, icon: Icon, value }) => (

              <div
                key={field}
                className="p-3 rounded-lg bg-slate-50 border border-slate-100"
              >

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">

                  <Icon className="w-3.5 h-3.5" />

                  {label}

                </div>


                {editing ? (

                  <input
                    value={value ?? ''}
                    onChange={(e) =>
                      updateField(field, e.target.value)
                    }
                    className="w-full text-sm font-medium text-slate-900 border border-primary-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />

                ) : (

                  <p className="text-sm font-medium text-slate-900">
                    {value}
                  </p>

                )}

              </div>

            ))}

          </div>

        </div>

      </div>


      {/* Quick Actions */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {[
          {
            label: 'Linked Projects',
            value: '2',
            to: '/projects',
          },

          {
            label: 'Active Approvals',
            value: '4',
            to: '/approval-roadmap',
          },

          {
            label: 'Documents',
            value: '7',
            to: '/documents',
          },

          {
            label: 'Compliance Items',
            value: '6',
            to: '/compliance',
          },

        ].map(({ label, value, to }) => (

          <a
            key={label}
            href={to}
            className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md hover:border-primary-100 transition-all group"
          >

            <p className="text-2xl font-bold text-slate-900">
              {value}
            </p>

            <p className="text-xs text-slate-500 group-hover:text-primary-600 transition-colors">
              {label}
            </p>

          </a>

        ))}

      </div>

    </div>
  )
}