import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'freelancer' as 'freelancer' | 'client'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleSocialSignup = (provider: string) => {
    console.log(`Signing up with ${provider}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,#00f5c410,transparent_50%)]"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-gray-900 via-gray-900/95 to-gray-900/50"></div>
      </div>
      
      <div className="relative max-w-md w-full">
        {/* Glowing orb effects */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-code-green/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-code-green/10 rounded-full blur-3xl"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-800/50"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-code-green hover:text-code-green/90 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: FaGoogle, name: 'Google' },
                { icon: FaGithub, name: 'GitHub' },
                { icon: FaLinkedin, name: 'LinkedIn' }
              ].map(({ icon: Icon, name }) => (
                <button
                  key={name}
                  onClick={() => handleSocialSignup(name)}
                  className="group relative flex items-center justify-center p-3 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200"
                >
                  <Icon className="h-6 w-6 text-code-green group-hover:scale-110 transition-transform duration-200" />
                  <span className="sr-only">Sign up with {name}</span>
                </button>
              ))}
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900 text-gray-400">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="radio"
                      id="freelancer"
                      name="accountType"
                      value="freelancer"
                      checked={formData.accountType === 'freelancer'}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor="freelancer"
                      className="flex items-center justify-center p-3 w-full text-gray-400 bg-gray-800/50 border border-gray-700 rounded-xl cursor-pointer peer-checked:border-code-green peer-checked:text-code-green hover:bg-gray-800 transition-all duration-200"
                    >
                      Freelancer
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="radio"
                      id="client"
                      name="accountType"
                      value="client"
                      checked={formData.accountType === 'client'}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor="client"
                      className="flex items-center justify-center p-3 w-full text-gray-400 bg-gray-800/50 border border-gray-700 rounded-xl cursor-pointer peer-checked:border-code-green peer-checked:text-code-green hover:bg-gray-800 transition-all duration-200"
                    >
                      Client
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-xl text-black font-semibold bg-code-green hover:bg-code-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-code-green focus:ring-offset-gray-900 transition-all duration-200"
              >
                Create Account
              </button>
            </form>

            <p className="text-center text-xs text-gray-400">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-code-green hover:text-code-green/90">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-code-green hover:text-code-green/90">
                Privacy Policy
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
