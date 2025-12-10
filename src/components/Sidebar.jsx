import { Link, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: '/', icon: 'home', label: 'Dashboard' },
    { path: '/stats', icon: 'chart', label: 'Coding Stats' },
    { path: '/challenges', icon: 'trophy', label: 'Groups' },
    { path: '/profile', icon: 'user', label: 'Profile' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 h-[calc(100vh-4rem)] sticky top-16 shadow-md">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-primary text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{getIcon(item.icon)}</span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

const getIcon = (iconName) => {
  const icons = {
    home: '🏠',
    chart: '📊',
    trophy: '🏆',
    user: '👤',
  };
  return icons[iconName] || '📄';
};
