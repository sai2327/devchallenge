import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { formatDate } from '../utils/formatters';

export const GroupCard = ({ group, onLeave, isMember = true }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {group.name}
        </h3>
        {group.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {group.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span>👥 {group.members?.length || 0} members</span>
        <span>🏆 {group.challenges?.length || 0} challenges</span>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
        Created {formatDate(group.createdAt)}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/group/${group.id || group.groupId}`)}
          className="flex-1"
        >
          View Group
        </Button>
        
        {isMember && onLeave && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLeave(group.id || group.groupId)}
          >
            Leave
          </Button>
        )}
      </div>
    </div>
  );
};
