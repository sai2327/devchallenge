import { z } from 'zod';

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Signup schema
export const signupSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Profile schema
export const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  phone: z.string().optional().refine((val) => {
    if (!val) return true;
    return /^\+?[\d\s-()]+$/.test(val);
  }, 'Invalid phone number'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  codingProfiles: z.object({
    leetcode: z.string().optional(),
    codechef: z.string().optional(),
    hackerrank: z.string().optional(),
    codeforces: z.string().optional(),
  }).optional(),
});

// Group creation schema
export const createGroupSchema = z.object({
  name: z.string().min(3, 'Group name must be at least 3 characters').max(50),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

// Join group schema
export const joinGroupSchema = z.object({
  groupId: z.string().min(1, 'Group ID is required'),
});

// Challenge creation schema
export const createChallengeSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  deadline: z.string().refine((val) => {
    const date = new Date(val);
    return date > new Date();
  }, 'Deadline must be in the future'),
  platform: z.enum(['leetcode', 'codechef', 'hackerrank', 'codeforces']),
  problemLink: z.string().url('Invalid URL').optional(),
});

// Add friend schema
export const addFriendSchema = z.object({
  friendId: z.string().min(1, 'Friend ID is required'),
});

// Validate email
export const validateEmail = (email) => {
  try {
    z.string().email().parse(email);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: 'Invalid email address' };
  }
};

// Validate URL
export const validateURL = (url) => {
  try {
    z.string().url().parse(url);
    return { valid: true, error: null };
  } catch (error) {
    return { valid: false, error: 'Invalid URL' };
  }
};

// Validate file size
export const validateFileSize = (file, maxSize) => {
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${maxSize / (1024 * 1024)}MB`,
    };
  }
  return { valid: true, error: null };
};

// Validate file type
export const validateFileType = (file, allowedTypes) => {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`,
    };
  }
  return { valid: true, error: null };
};

// Validate date
export const validateDate = (date) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return { valid: false, error: 'Invalid date' };
  }
  return { valid: true, error: null };
};

// Validate phone number
export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: 'Invalid phone number' };
  }
  return { valid: true, error: null };
};
