import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { auth } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// OAuth Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');
const linkedinProvider = new OAuthProvider('oidc.linkedin');

// Generate unique user ID
export const generateUserId = () => {
  return `USER${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

// Create user profile in Firestore
const createUserProfile = async (user, additionalData = {}) => {
  const userRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = new Date().toISOString();
    const userId = generateUserId();

    try {
      await setDoc(userRef, {
        userId,
        email,
        displayName: displayName || email.split('@')[0],
        photoURL: photoURL || '',
        phone: '',
        bio: '',
        createdAt,
        codingProfiles: {
          leetcode: '',
          codechef: '',
          hackerrank: '',
          codeforces: '',
        },
        friends: [],
        groups: [],
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  return userRef;
};

// Google OAuth Login
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// GitHub OAuth Login
export const loginWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    console.error('GitHub login error:', error);
    throw error;
  }
};

// Microsoft OAuth Login
export const loginWithMicrosoft = async () => {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    console.error('Microsoft login error:', error);
    throw error;
  }
};

// LinkedIn OAuth Login
export const loginWithLinkedin = async () => {
  try {
    const result = await signInWithPopup(auth, linkedinProvider);
    await createUserProfile(result.user);
    return result.user;
  } catch (error) {
    console.error('LinkedIn login error:', error);
    throw error;
  }
};

// Email/Password Login
export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('Email login error:', error);
    throw error;
  }
};

// Email/Password Signup
export const signupWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(result.user, { displayName });
    return result.user;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
