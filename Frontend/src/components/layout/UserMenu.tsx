import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface MenuItem {
  label?: string;
  to?: string;
  action?: 'logout';
  roles?: string[]; // show only for these roles if provided
  divider?: boolean;
}

const menuItems: MenuItem[] = [
  { label: 'Profile', to: '/settings/profile' },
  { label: 'Change Password', to: '/settings/change-password' },
  { label: 'Orders', to: '/orders' },
  { label: 'Earnings', to: '/earnings' },
  { label: 'Delete Account', to: '/settings/delete-account' },
  { divider: true },
  { label: 'Logout', action: 'logout' },
];

const UserMenu = () => {
  const { user, logout } = useAuth();

  return (
    <div className="absolute right-0 mt-2 w-56 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
      {menuItems.map((item, idx) => {
        if (item.divider) {
          return <div key={idx} className="border-t border-gray-700 my-1" />;
        }
        

        const classes =
          'block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white';

        if (item.action === 'logout') {
          return (
            <button key={idx} onClick={logout} className={classes}>
              {item.label}
            </button>
          );
        }
        return (
          <Link key={idx} to={item.to!} className={classes}>
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default UserMenu;
