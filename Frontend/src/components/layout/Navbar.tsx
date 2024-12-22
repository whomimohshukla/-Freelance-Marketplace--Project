import  { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronDown } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background with blur and gradient */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <Link 
              to="/" 
              className="flex items-center group"
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-code-green to-[#80FFF2] bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                SkillBridge
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Features Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-200 group">
                <span>Features</span>
                <FiChevronDown className="h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                <div className="relative">
                  {/* Backdrop blur and gradient */}
                  <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800/50 shadow-xl"></div>
                  
                  <div className="relative py-2 px-3">
                    <Link to="/features/search" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                      Search Projects
                    </Link>
                    <Link to="/features/messaging" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                      Messaging
                    </Link>
                    <Link to="/features/video-call" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                      Video Call
                    </Link>
                    <Link to="/features/payments" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                      Secure Payments
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-200 group">
                <span>Resources</span>
                <FiChevronDown className="h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left">
                <div className="relative">
                  {/* Backdrop blur and gradient */}
                  <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800/50 shadow-xl"></div>
                  
                  <div className="relative py-2 px-3">
                    <Link to="/resources/blog" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                      Blog
                    </Link>
                    <Link to="/resources/guides" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                      Guides
                    </Link>
                    <Link to="/resources/help" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">
                      Help Center
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link 
              to="/pricing" 
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors relative group"
            >
              Pricing
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-code-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              to="/login"
              className="relative px-3 py-2 text-sm font-medium text-gray-300 transition-colors group"
            >
              <span className="relative z-10">Sign in</span>
              <div className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left">
                <div className="absolute inset-0 bg-gray-800/50 rounded-lg"></div>
              </div>
            </Link>
            <Link
              to="/register"
              className="relative px-4 py-2 text-sm font-medium text-gray-900 group"
            >
              <span className="absolute inset-0 bg-code-green rounded-lg transition-transform duration-200 group-hover:scale-105"></span>
              <span className="relative z-10">Sign up</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative p-2 rounded-lg text-gray-400 hover:text-white focus:outline-none group"
            >
              <span className="sr-only">Open main menu</span>
              <div className="h-6 w-6 flex flex-col justify-between">
                <span className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
              <div className="absolute inset-0 rounded-lg bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden fixed inset-x-0 top-[72px] transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
      >
        <div className="relative">
          {/* Backdrop blur and gradient */}
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800/50"></div>
          
          <div className="relative px-2 pt-2 pb-3 space-y-1">
            {/* Features Section */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-base font-medium text-gray-300">Features</div>
              <Link
                to="/features/search"
                className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Search Projects
              </Link>
              <Link
                to="/features/messaging"
                className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Messaging
              </Link>
              <Link
                to="/features/video-call"
                className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Video Call
              </Link>
              <Link
                to="/features/payments"
                className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Secure Payments
              </Link>
            </div>

            {/* Resources Section */}
            <div className="space-y-1 mt-2">
              <div className="px-3 py-2 text-base font-medium text-gray-300">Resources</div>
              <Link
                to="/resources/blog"
                className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/resources/guides"
                className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Guides
              </Link>
              <Link
                to="/resources/help"
                className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Help Center
              </Link>
            </div>

            <Link
              to="/pricing"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors mt-2"
            >
              Pricing
            </Link>

            <div className="pt-4 mt-2 border-t border-gray-800/50">
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 text-base font-medium text-white bg-code-green hover:bg-code-green/90 rounded-lg transition-colors mt-2"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar