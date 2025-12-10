import { useState, useEffect } from 'react';
import { supabase } from '../services/firebase';
import * as authService from '../services/authService';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const user = await authService.loginWithGoogle();
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGithub = async () => {
    try {
      const user = await authService.loginWithGithub();
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      const user = await authService.loginWithMicrosoft();
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithLinkedin = async () => {
    try {
      const user = await authService.loginWithLinkedin();
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithEmail = async (email, password) => {
    try {
      const user = await authService.loginWithEmail(email, password);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email, password, displayName) => {
    try {
      const user = await authService.signupWithEmail(email, password, displayName);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    currentUser,
    loading,
    loginWithGoogle,
    loginWithGithub,
    loginWithMicrosoft,
    loginWithLinkedin,
    loginWithEmail,
    signup,
    logout,
  };
};
