import { supabase } from './firebase';

// Generate unique user ID
export const generateUserId = () => {
  return `USER${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

// Create user profile in database
const createUserProfile = async (user, additionalData = {}) => {
  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!existingUser) {
    const userId = generateUserId();
    const userProfile = {
      id: user.id,
      user_id: userId,
      email: user.email,
      display_name: additionalData.displayName || user.user_metadata?.full_name || user.email?.split('@')[0] || '',
      photo_url: user.user_metadata?.avatar_url || '',
      phone: '',
      bio: '',
      created_at: new Date().toISOString(),
      coding_profiles: {
        leetcode: '',
        codechef: '',
        hackerrank: '',
        codeforces: '',
      },
      friends: [],
      groups: [],
      ...additionalData,
    };

    const { error } = await supabase
      .from('users')
      .insert([userProfile]);

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }
};

// Google OAuth Login
export const loginWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// GitHub OAuth Login
export const loginWithGithub = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('GitHub login error:', error);
    throw error;
  }
};

// Microsoft OAuth Login
export const loginWithMicrosoft = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Microsoft login error:', error);
    throw error;
  }
};

// LinkedIn OAuth Login (Note: LinkedIn requires Azure setup with Supabase)
export const loginWithLinkedin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('LinkedIn login error:', error);
    throw error;
  }
};

// Email/Password Login
export const loginWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Email login error:', error);
    throw error;
  }
};

// Email/Password Signup
export const signupWithEmail = async (email, password, displayName) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
        },
      },
    });

    if (error) throw error;
    
    if (data.user) {
      await createUserProfile(data.user, { displayName });
    }

    return data.user;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
