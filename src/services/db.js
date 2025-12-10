import { supabase } from './firebase';

// ============ USER OPERATIONS ============

export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const addFriend = async (userId, friendId) => {
  try {
    // Get current friends array
    const { data: user } = await supabase
      .from('users')
      .select('friends')
      .eq('id', userId)
      .single();

    const friends = user?.friends || [];
    if (!friends.includes(friendId)) {
      friends.push(friendId);
    }

    const { error } = await supabase
      .from('users')
      .update({ friends })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

export const removeFriend = async (userId, friendId) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('friends')
      .eq('id', userId)
      .single();

    const friends = (user?.friends || []).filter(id => id !== friendId);

    const { error } = await supabase
      .from('users')
      .update({ friends })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

export const getFriends = async (friendIds) => {
  try {
    if (!friendIds || friendIds.length === 0) return [];

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('id', friendIds);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting friends:', error);
    throw error;
  }
};

export const searchUsers = async (searchTerm) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`display_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// ============ GROUP OPERATIONS ============

export const createGroup = async (groupData) => {
  try {
    const { data, error } = await supabase
      .from('groups')
      .insert([{
        ...groupData,
        created_at: new Date().toISOString(),
      }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const getGroup = async (groupId) => {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', groupId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting group:', error);
    throw error;
  }
};

export const getUserGroups = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .contains('members', [userId]);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting user groups:', error);
    throw error;
  }
};

export const updateGroup = async (groupId, updates) => {
  try {
    const { data, error } = await supabase
      .from('groups')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', groupId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
};

export const deleteGroup = async (groupId) => {
  try {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', groupId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};

export const addGroupMember = async (groupId, userId) => {
  try {
    const { data: group } = await supabase
      .from('groups')
      .select('members')
      .eq('id', groupId)
      .single();

    const members = group?.members || [];
    if (!members.includes(userId)) {
      members.push(userId);
    }

    const { error } = await supabase
      .from('groups')
      .update({ members })
      .eq('id', groupId);

    if (error) throw error;
  } catch (error) {
    console.error('Error adding group member:', error);
    throw error;
  }
};

export const removeGroupMember = async (groupId, userId) => {
  try {
    const { data: group } = await supabase
      .from('groups')
      .select('members')
      .eq('id', groupId)
      .single();

    const members = (group?.members || []).filter(id => id !== userId);

    const { error } = await supabase
      .from('groups')
      .update({ members })
      .eq('id', groupId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing group member:', error);
    throw error;
  }
};

// ============ CHALLENGE OPERATIONS ============

export const createChallenge = async (challengeData) => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .insert([{
        ...challengeData,
        created_at: new Date().toISOString(),
      }])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

export const getChallenge = async (challengeId) => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting challenge:', error);
    throw error;
  }
};

export const getGroupChallenges = async (groupId) => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting group challenges:', error);
    throw error;
  }
};

export const updateChallenge = async (challengeId, updates) => {
  try {
    const { data, error } = await supabase
      .from('challenges')
      .update(updates)
      .eq('id', challengeId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating challenge:', error);
    throw error;
  }
};

export const deleteChallenge = async (challengeId) => {
  try {
    const { error } = await supabase
      .from('challenges')
      .delete()
      .eq('id', challengeId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw error;
  }
};

export const submitChallengeProgress = async (challengeId, userId, progress) => {
  try {
    const { data, error } = await supabase
      .from('challenge_progress')
      .upsert({
        challenge_id: challengeId,
        user_id: userId,
        ...progress,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error submitting challenge progress:', error);
    throw error;
  }
};

export const getChallengeProgress = async (challengeId) => {
  try {
    const { data, error } = await supabase
      .from('challenge_progress')
      .select(`
        *,
        users (
          id,
          user_id,
          display_name,
          photo_url
        )
      `)
      .eq('challenge_id', challengeId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting challenge progress:', error);
    throw error;
  }
};

// ============ LEADERBOARD OPERATIONS ============

export const updateLeaderboard = async (groupId, userId, stats) => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .upsert({
        group_id: groupId,
        user_id: userId,
        ...stats,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    throw error;
  }
};

export const getGroupLeaderboard = async (groupId) => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select(`
        *,
        users (
          id,
          user_id,
          display_name,
          photo_url
        )
      `)
      .eq('group_id', groupId)
      .order('total_score', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting group leaderboard:', error);
    throw error;
  }
};

export const getGlobalLeaderboard = async () => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select(`
        user_id,
        total_score,
        users (
          id,
          user_id,
          display_name,
          photo_url
        )
      `)
      .order('total_score', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Aggregate scores by user
    const userScores = {};
    data?.forEach(entry => {
      const userId = entry.user_id;
      if (!userScores[userId]) {
        userScores[userId] = {
          user: entry.users,
          totalScore: 0,
        };
      }
      userScores[userId].totalScore += entry.total_score || 0;
    });

    return Object.values(userScores)
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 100);
  } catch (error) {
    console.error('Error getting global leaderboard:', error);
    throw error;
  }
};

// ============ REAL-TIME LISTENERS ============

export const subscribeToGroup = (groupId, callback) => {
  const channel = supabase
    .channel(`group:${groupId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'groups',
        filter: `id=eq.${groupId}`,
      },
      (payload) => {
        callback(payload.new);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToChallenges = (groupId, callback) => {
  const channel = supabase
    .channel(`challenges:${groupId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'challenges',
        filter: `group_id=eq.${groupId}`,
      },
      () => {
        // Fetch all challenges when any change occurs
        getGroupChallenges(groupId).then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToLeaderboard = (groupId, callback) => {
  const channel = supabase
    .channel(`leaderboard:${groupId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leaderboard',
        filter: `group_id=eq.${groupId}`,
      },
      () => {
        // Fetch leaderboard when any change occurs
        getGroupLeaderboard(groupId).then(callback);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
