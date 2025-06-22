import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../api/auth'
import { motion } from 'framer-motion'
import { FaGoogle, FaGithub, FaLinkedin } from 'react-icons/fa'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await loginUser({ email, password });
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/settings/profile');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  const handleSocialLogin = (provider: string) => {
    // Handle social login logic here
    console.log(`Logging in with ${provider}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00f5c410,transparent_50%)]"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-900/50"></div>
      </div>
      
      <div className="relative max-w-md w-full">
        
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-code-green/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-code-green/10 rounded-full blur-3xl"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-800/50"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-code-green hover:text-code-green/90 font-medium transition-colors">
                Sign up
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
                  onClick={() => handleSocialLogin(name)}
                  className="group relative flex items-center justify-center p-3 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200"
                >
                  <Icon className="h-6 w-6 text-code-green group-hover:scale-110 transition-transform duration-200" />
                  <span className="sr-only">Sign in with {name}</span>
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-code-green focus:ring-code-green focus:ring-offset-gray-900"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-code-green hover:text-code-green/90 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-xl text-black font-semibold bg-code-green hover:bg-code-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-code-green focus:ring-offset-gray-900 transition-all duration-200"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
