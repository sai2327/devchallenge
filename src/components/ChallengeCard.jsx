import { formatTimeRemaining, formatDifficulty, formatPlatformName } from '../utils/formatters';
import { Button } from './Button';

export const ChallengeCard = ({ 
  challenge, 
  onComplete, 
  onDelete, 
  isCompleted,
  isCreator,
  currentUserId,
}) => {
  const isExpired = new Date(challenge.deadline) < new Date();
  const difficulty = formatDifficulty(challenge.difficulty);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 ${
      isCompleted 
        ? 'border-success' 
        : isExpired 
        ? 'border-gray-400' 
        : 'border-primary'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {challenge.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {challenge.description}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className={`font-medium ${difficulty.color}`}>
              {difficulty.label}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {formatPlatformName(challenge.platform)}
            </span>
          </div>
        </div>
        
        {!isExpired && !isCompleted && (
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              ⏰ {formatTimeRemaining(challenge.deadline)}
            </span>
          </div>
        )}
      </div>

      {isExpired && (
        <div className="text-sm text-gray-500 mb-4">
          ❌ Expired
        </div>
      )}

      {isCompleted && (
        <div className="text-sm text-success mb-4">
          ✅ Completed
        </div>
      )}

      {challenge.problemLink && (
        <a
          href={challenge.problemLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline text-sm mb-4 block"
        >
          View Problem →
        </a>
      )}

      <div className="flex items-center gap-2 mt-4">
        {!isCompleted && !isExpired && (
          <Button
            variant="success"
            size="sm"
            onClick={() => onComplete(challenge.id)}
          >
            Mark Complete
          </Button>
        )}
        
        {isCreator && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(challenge.id)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};
