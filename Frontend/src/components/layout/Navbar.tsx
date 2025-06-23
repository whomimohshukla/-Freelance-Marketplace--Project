import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiLogOut, FiUser, FiGift, FiBookOpen, FiBriefcase, FiBell, FiMessageSquare, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const handleMobileNavigate = () => setIsMenuOpen(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const avatarUrl = user?.avatar ?? `https://ui-avatars.com/api/?name=${user?.firstName ?? 'U'}&background=00F5C4&color=0A1828`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Background */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50" />
      {/* Grid overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-10" />
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
            <Link to="/" className="flex items-center group">
              <span className="text-2xl font-bold bg-gradient-to-r from-code-green to-[#80FFF2] bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                SkillBridge
              </span>
            </Link>
          </motion.div>

          {/* Desktop nav links */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {/* Features dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-200 group">
                <span>Features</span>
                <FiChevronDown className="h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-left">
                <div className="relative">
                  <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800/50 shadow-xl" />
                  <div className="relative py-2 px-3 space-y-1">
                    <Link to="/features/search" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Search Projects</Link>
                    <Link to="/features/messaging" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Messaging</Link>
                    <Link to="/features/video-call" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Video Call</Link>
                    <Link to="/features/payments" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Secure Payments</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Resources dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-all duration-200 group">
                <span>Resources</span>
                <FiChevronDown className="h-4 w-4 transform group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute left-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-left">
                <div className="relative">
                  <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl rounded-xl border border-gray-800/50 shadow-xl" />
                  <div className="relative py-2 px-3 space-y-1">
                    <Link to="/resources/blog" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Blog</Link>
                    <Link to="/resources/guides" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Guides</Link>
                    <Link to="/resources/help" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Help Center</Link>
                  </div>
                </div>
              </div>
            </div>

            <Link to="/pricing" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors relative group">
              Pricing
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-code-green transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </Link>
          </div>

          {/* User section */}
          {user ? (
            <div className="hidden md:flex md:items-center md:space-x-4 relative group">
              <button className="relative text-gray-400 hover:text-white focus:outline-none mr-2">
                <FiBell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1 text-[10px] font-bold leading-none text-white bg-code-green rounded-full">3</span>
              </button>
              <button className="relative text-gray-400 hover:text-white focus:outline-none mr-2">
                <FiMessageSquare className="h-5 w-5" />
              </button>
              <button className="relative text-gray-400 hover:text-white focus:outline-none mr-2">
                <FiHeart className="h-5 w-5" />
              </button>
              <div className="relative group">
                <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover cursor-pointer" />
                <span className="absolute inset-0 rounded-full ring-2 ring-code-green/70 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {/* Dropdown */}
              <div className="absolute right-4 top-12 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="relative">
                  <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-800/60 ring-1 ring-code-green/30 shadow-2xl" />
                      {/* arrow */}
                      <div className="absolute right-6 -top-2 w-4 h-4 rotate-45 bg-gray-900/95 border-t border-l border-gray-800/60 ring-1 ring-code-green/30" />
                  <div className="relative divide-y divide-gray-800">
                    {/* header */}
                    <div className="px-4 py-4 flex items-center gap-3">
                      <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-semibold text-white leading-none">{user.firstName ?? 'User'}</p>
                        <Link to={`/profile/${user.firstName ?? user._id}`} className="text-xs text-code-green hover:underline">View Profile</Link>
                      </div>
                    </div>

                    {/* main links */}
                    <div className="flex flex-col px-4 py-4 text-sm space-y-1 text-gray-100">
                      {/* Buying */}
                      <div className="flex flex-col space-y-1">
                        <p className="text-gray-400 text-[10px] uppercase tracking-wide mb-1">Buying</p>
                        <Link to="/orders" className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800/60 truncate"><FiBriefcase /> Orders</Link>
                        <Link to="/help-center" className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800/60 truncate">Help Center</Link>
                        <Link to="/briefs" className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800/60 truncate"><FiBookOpen /> My Briefs</Link>
                      </div>

                      {/* Selling */}
                      <div className="flex flex-col space-y-1">
                        <p className="text-gray-400 text-[10px] uppercase tracking-wide mb-1">Selling</p>
                        <Link to="/earnings" className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800/60 truncate"><FiBookOpen /> Earnings</Link>
                        <Link to="/become-freelancer" className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800/60 truncate">Become Seller</Link>
                        <Link to="/refer-friend" className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800/60 truncate"><FiGift /> Refer a Friend</Link>
                      </div>
                    </div>

                    {/* footer */}
                    <div className="px-4 py-3 flex flex-col space-y-1">
                      <Link to="/settings/profile" className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800/60 truncate">Settings</Link>
                      <button onClick={logout} className="flex items-center gap-2 px-2 py-1 rounded-md text-red-400 hover:text-white hover:bg-gray-800/60"><FiLogOut /> Logout</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link to="/login" className="relative px-3 py-2 text-sm font-medium text-gray-300 transition-colors group">
                <span className="relative z-10">Sign in</span>
                <div className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left">
                  <div className="absolute inset-0 bg-gray-800/50 rounded-lg" />
                </div>
              </Link>
              <Link to="/register" className="relative px-4 py-2 text-sm font-medium text-gray-900 group">
                <span className="absolute inset-0 bg-code-green rounded-lg transition-transform duration-200 group-hover:scale-105" />
                <span className="relative z-10">Sign up</span>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative p-2 rounded-lg text-gray-400 hover:text-white focus:outline-none group">
              <span className="sr-only">Open menu</span>
              <div className="h-6 w-6 flex flex-col justify-between">
                <span className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-full h-0.5 bg-current transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
              </div>
              <div className="absolute inset-0 rounded-lg bg-gray-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div className={`md:hidden fixed inset-x-0 top-[72px] transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="relative">
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800/50" />
          <div className="relative px-2 pt-2 pb-3 space-y-1">
            {/* Feature links */}
            <Link to="/features/search" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Search Projects</Link>
            <Link to="/features/messaging" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Messaging</Link>
            <Link to="/features/video-call" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Video Call</Link>
            <Link to="/features/payments" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Secure Payments</Link>

            <div className="border-t border-gray-800/50 my-2" />

            {user ? (
              <>
                <Link to={`/profile/${user.firstName ?? user._id}`} onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Profile</Link>
                <Link to="/orders" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Orders</Link>
                <Link to="/earnings" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Earnings</Link>
                <Link to="/help-center" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Help Center</Link>
                <Link to="/briefs" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">My Briefs</Link>
                <Link to="/refer-friend" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Refer a Friend</Link>
                <Link to="/become-freelancer" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Become a Seller</Link>
                <Link to="/settings/profile" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Settings</Link>
                <Link to="/orders" className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Orders</Link>
                <Link to="/earnings" className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Earnings</Link>
                <Link to="/help-center" className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Help Center</Link>
                <Link to="/briefs" className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">My Briefs</Link>
                <Link to="/refer-friend" className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Refer a Friend</Link>
                <Link to="/become-freelancer" className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Become a Seller</Link>
                <Link to="/settings/profile" className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Settings</Link>
                <button onClick={() => { setIsMenuOpen(false); logout(); }} className="w-full text-left px-6 py-2 text-sm text-red-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors">Sign in</Link>
                <Link to="/register" onClick={handleMobileNavigate} className="block px-6 py-2 text-sm text-white bg-code-green hover:bg-code-green/90 rounded-lg transition-colors">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;