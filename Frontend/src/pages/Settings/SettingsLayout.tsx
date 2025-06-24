import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const menu = [
  { label: 'Profile', to: '/settings/profile' },
  { label: 'Security', to: '/settings/change-password' },
  { label: 'Two-Factor Auth', to: '/settings/2fa' },
  { label: 'Social Accounts', to: '/settings/social' },
  { label: 'Notifications', to: '/settings/notifications' },
  { label: 'Billing', to: '/settings/billing' },
  { label: 'Delete Account', to: '/settings/delete-account', danger: true },
];

const SettingsLayout = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8"
    >
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-gray-900/60 border border-gray-800 rounded-xl p-6 h-max">
        <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>
        <nav className="flex flex-col space-y-2">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${isActive ? 'bg-code-green text-black' : 'text-gray-300 hover:bg-gray-800'} ${
                  item.danger ? 'text-red-400 hover:text-red-300' : ''
                } px-4 py-2 rounded-lg transition-colors`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <section className="flex-1 min-w-0">
        <Outlet />
      </section>
    </motion.div>
  );
};

export default SettingsLayout;
