// Format date
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

// Format date with time
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  
  return `${d.toLocaleDateString('en-US', dateOptions)} at ${d.toLocaleTimeString('en-US', timeOptions)}`;
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

// Format time remaining (for deadlines)
export const formatTimeRemaining = (deadline) => {
  if (!deadline) return '';
  
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;
  
  if (diff < 0) return 'Expired';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

// Format number with commas
export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toLocaleString('en-US');
};

// Format points
export const formatPoints = (points) => {
  if (!points) return '0 pts';
  return `${formatNumber(points)} pts`;
};

// Format percentage
export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Format username (remove special characters)
export const formatUsername = (username) => {
  if (!username) return '';
  return username.replace(/[^a-zA-Z0-9_]/g, '');
};

// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Format rank
export const formatRank = (rank) => {
  if (!rank) return '';
  
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = rank % 100;
  
  return rank + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

// Format difficulty
export const formatDifficulty = (difficulty) => {
  if (!difficulty) return '';
  
  const colors = {
    easy: 'text-green-600',
    medium: 'text-yellow-600',
    hard: 'text-red-600',
  };
  
  return {
    label: capitalize(difficulty),
    color: colors[difficulty] || 'text-gray-600',
  };
};

// Format platform name
export const formatPlatformName = (platform) => {
  const names = {
    leetcode: 'LeetCode',
    codechef: 'CodeChef',
    hackerrank: 'HackerRank',
    codeforces: 'CodeForces',
  };
  
  return names[platform] || capitalize(platform);
};

// Format initials from name
export const getInitials = (name) => {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
