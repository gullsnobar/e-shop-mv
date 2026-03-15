import React, { useState } from 'react'

const Signup = () => {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const getStrength = (val) => {
    let score = 0
    if (val.length >= 8) score++
    if (/[A-Z]/.test(val)) score++
    if (/[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    return score
  }

  const strengthConfig = [
    { color: 'bg-red-500',    label: 'Weak',   text: 'text-red-500'    },
    { color: 'bg-orange-500', label: 'Fair',   text: 'text-orange-500' },
    { color: 'bg-yellow-400', label: 'Good',   text: 'text-yellow-600' },
    { color: 'bg-green-500',  label: 'Strong', text: 'text-green-600'  },
  ]

  const score = getStrength(password)

  const EyeIcon = ({ open }) => open ? (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/60 border border-gray-100 overflow-hidden">

          {/* Top bar */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-blue-700" />

          <div className="px-7 py-6">

            {/* Header */}
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900">Create Account</h2>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">Fill in the details to get started</p>
            </div>

            {/* Name Row */}
            <div className="grid grid-cols-2 gap-2.5 mb-3.5">
              {[
                { label: 'First Name', placeholder: 'Enter first name' },
                { label: 'Last Name',  placeholder: 'Enter last name'  },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">{label}</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-blue-400">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder={placeholder}
                      className="w-full pl-8 pr-2 py-2.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3.5">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all bg-gray-50 focus:bg-white"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-1.5">
                  <div className="flex gap-1">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < score ? strengthConfig[score-1].color : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className={`text-xs font-semibold mt-0.5 ${strengthConfig[score-1]?.text}`}>
                    {strengthConfig[score-1]?.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition-all bg-gray-50 focus:bg-white"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0">
              Create Account
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-3.5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 font-medium">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Google */}
            <button className="w-full py-2.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 flex items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Terms */}
            <p className="text-center text-xs text-gray-400 mt-3 leading-relaxed">
              By signing up, you agree to our{' '}
              <a href="#" className="text-blue-600 font-semibold hover:underline">Terms</a>
              {' '}&{' '}
              <a href="#" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>
            </p>

            {/* Switch */}
            <p className="text-center text-xs text-gray-400 mt-2">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 font-bold hover:underline">Sign in</a>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup