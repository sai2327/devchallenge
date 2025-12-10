import { useState, useEffect } from 'react';
import * as db from '../services/db';

export const useGroup = (groupId = null, userId = null) => {
  const [group, setGroup] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch single group
  useEffect(() => {
    if (!groupId) return;

    const fetchGroup = async () => {
      try {
        setLoading(true);
        const groupData = await db.getGroup(groupId);
        setGroup(groupData);

        if (groupData?.members && groupData.members.length > 0) {
          const membersData = await db.getFriends(groupData.members);
          setMembers(membersData);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching group:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();

    // Subscribe to real-time updates
    const unsubscribe = db.subscribeToGroup(groupId, (groupData) => {
      setGroup(groupData);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [groupId]);

  // Fetch user's groups
  useEffect(() => {
    if (!userId) return;

    const fetchUserGroups = async () => {
      try {
        setLoading(true);
        const userProfile = await db.getUserProfile(userId);
        
        if (userProfile?.groups && userProfile.groups.length > 0) {
          const groupsData = await db.getUserGroups(userProfile.groups);
          setUserGroups(groupsData);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching user groups:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroups();
  }, [userId]);

  const createGroup = async (groupData) => {
    try {
      const groupId = await db.createGroup(groupData);
      return { success: true, groupId };
    } catch (error) {
      console.error('Error creating group:', error);
      return { success: false, error: error.message };
    }
  };

  const joinGroup = async (groupId, userId) => {
    try {
      await db.joinGroup(groupId, userId);
      return { success: true };
    } catch (error) {
      console.error('Error joining group:', error);
      return { success: false, error: error.message };
    }
  };

  const leaveGroup = async (groupId, userId) => {
    try {
      await db.leaveGroup(groupId, userId);
      return { success: true };
    } catch (error) {
      console.error('Error leaving group:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      await db.deleteGroup(groupId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting group:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    group,
    userGroups,
    members,
    loading,
    error,
    createGroup,
    joinGroup,
    leaveGroup,
    deleteGroup,
  };
};
