import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed w-full z-50 backdrop-blur-md bg-dark-blue/80 border-b border-code-green/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center"
          >
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-code-green to-[#80FFF2] text-transparent bg-clip-text hover:scale-105 transition-transform">
              SkillBridge
            </a>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {['Find Talent', 'Find Work', 'Why Us'].map((item, index) => (
              <motion.a
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                href="#"
                className="text-sm text-gray-300 hover:text-code-green transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-code-green transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="ml-6 flex items-center space-x-3"
            >
              <button className="group text-sm bg-transparent text-gray-300 hover:text-code-green px-4 py-2 rounded-lg transition-colors relative">
                Sign In
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-code-green transition-all duration-300 group-hover:w-full"></span>
              </button>
              <button className="group text-sm bg-code-green hover:bg-accent-hover text-dark-blue px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)] relative overflow-hidden">
                <span className="relative z-10">Sign Up Free</span>
                <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></div>
              </button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="md:hidden text-gray-300 hover:text-code-green"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4 border-t border-code-green/10">
                {['Find Talent', 'Find Work', 'Why Us'].map((item, index) => (
                  <motion.a
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    href="#"
                    className="block text-sm text-gray-300 hover:text-code-green transition-colors relative group px-2"
                  >
                    {item}
                  </motion.a>
                ))}
                <div className="space-y-2 pt-2 border-t border-code-green/10">
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="w-full text-sm text-gray-300 hover:text-code-green px-4 py-2 rounded-lg transition-colors relative group"
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="group w-full text-sm bg-code-green hover:bg-accent-hover text-dark-blue px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(0,245,196,0.3)] relative overflow-hidden"
                  >
                    <span className="relative z-10">Sign Up Free</span>
                    <div className="absolute inset-0 h-full w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar