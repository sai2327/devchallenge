import { useState, useEffect } from 'react';
import * as db from '../services/db';
import * as storage from '../services/storage';

export const useUser = (userId) => {
  const [userProfile, setUserProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const profile = await db.getUserProfile(userId);
        setUserProfile(profile);

        if (profile?.friends && profile.friends.length > 0) {
          const friendsData = await db.getFriends(profile.friends);
          setFriends(friendsData);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    // Subscribe to real-time updates
    const unsubscribe = db.subscribeToUserProfile(userId, (profile) => {
      setUserProfile(profile);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId]);

  const updateUserProfile = async (data) => {
    try {
      await db.updateUserProfile(userId, data);
      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: error.message };
    }
  };

  const uploadProfilePhoto = async (file) => {
    try {
      const photoURL = await storage.uploadProfilePhoto(userId, file);
      await db.updateUserProfile(userId, { photoURL });
      return { success: true, photoURL };
    } catch (error) {
      console.error('Error uploading photo:', error);
      return { success: false, error: error.message };
    }
  };

  const addFriend = async (friendId) => {
    try {
      await db.addFriend(userId, friendId);
      return { success: true };
    } catch (error) {
      console.error('Error adding friend:', error);
      return { success: false, error: error.message };
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await db.removeFriend(userId, friendId);
      return { success: true };
    } catch (error) {
      console.error('Error removing friend:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    userProfile,
    friends,
    loading,
    error,
    updateUserProfile,
    uploadProfilePhoto,
    addFriend,
    removeFriend,
  };
};
