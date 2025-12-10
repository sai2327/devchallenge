import { formatNumber } from '../utils/formatters';

export const StatCard = ({ icon, label, value, trend, color = 'primary' }) => {
  const colors = {
    primary: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    success: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300',
    error: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {formatNumber(value)}
          </p>
          {trend && (
            <p className={`text-sm mt-2 ${trend > 0 ? 'text-success' : 'text-error'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`${colors[color]} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
