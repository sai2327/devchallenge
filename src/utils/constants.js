// App constants

export const PLATFORMS = ['leetcode', 'codechef', 'hackerrank', 'codeforces'];

export const PLATFORM_NAMES = {
  leetcode: 'LeetCode',
  codechef: 'CodeChef',
  hackerrank: 'HackerRank',
  codeforces: 'CodeForces',
};

export const OAUTH_PROVIDERS = ['google', 'github', 'linkedin', 'microsoft'];

export const OAUTH_PROVIDER_NAMES = {
  google: 'Google',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  microsoft: 'Microsoft',
};

// File size limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_PROFILE_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Pagination
export const CHALLENGES_PER_PAGE = 20;
export const LEADERBOARD_PAGE_SIZE = 20;
export const GROUPS_PER_PAGE = 12;

// Points system
export const POINTS = {
  EASY_CHALLENGE: 10,
  MEDIUM_CHALLENGE: 20,
  HARD_CHALLENGE: 30,
  BONUS: 5,
};

// Toast durations (in ms)
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
};

// Messages
export const MESSAGES = {
  // Auth
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGOUT_SUCCESS: 'Logged out successfully',
  SIGNUP_SUCCESS: 'Account created successfully',
  
  // Profile
  PROFILE_UPDATE_SUCCESS: 'Profile updated successfully',
  PHOTO_UPLOAD_SUCCESS: 'Photo uploaded successfully',
  
  // Groups
  CREATE_GROUP_SUCCESS: 'Group created successfully',
  JOIN_GROUP_SUCCESS: 'Joined group successfully',
  LEAVE_GROUP_SUCCESS: 'Left group successfully',
  DELETE_GROUP_SUCCESS: 'Group deleted successfully',
  
  // Challenges
  CREATE_CHALLENGE_SUCCESS: 'Challenge created successfully',
  COMPLETE_CHALLENGE_SUCCESS: 'Challenge completed! Points added.',
  DELETE_CHALLENGE_SUCCESS: 'Challenge deleted successfully',
  
  // Friends
  ADD_FRIEND_SUCCESS: 'Friend added successfully',
  REMOVE_FRIEND_SUCCESS: 'Friend removed successfully',
  
  // Errors
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  ERROR_NETWORK: 'Network error. Please check your connection.',
  ERROR_AUTH: 'Authentication failed. Please try again.',
  ERROR_PERMISSION: 'You do not have permission to perform this action.',
  ERROR_FILE_SIZE: 'File size exceeds the maximum limit.',
  ERROR_FILE_TYPE: 'Invalid file type.',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  STATS: '/stats',
  CHALLENGES: '/challenges',
  GROUP: '/group/:groupId',
  LEADERBOARD: '/leaderboard/:groupId',
};

// Challenge difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

// Theme modes
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'devchallenge_theme',
  USER_PREFERENCES: 'devchallenge_user_preferences',
};

// Date formats
export const DATE_FORMATS = {
  FULL: 'MMMM dd, yyyy HH:mm',
  SHORT: 'MMM dd, yyyy',
  TIME: 'HH:mm',
};

// Social links
export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/devchallenge',
  GITHUB: 'https://github.com/devchallenge',
  DISCORD: 'https://discord.gg/devchallenge',
  LINKEDIN: 'https://linkedin.com/company/devchallenge',
};

// App metadata
export const APP_METADATA = {
  NAME: 'DevChallenge',
  TAGLINE: 'Code. Compete. Connect.',
  DESCRIPTION: 'A competitive programming social platform for developers',
  VERSION: '1.0.0',
};
