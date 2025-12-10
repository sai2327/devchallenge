import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from './firebase';

// ============ USER OPERATIONS ============

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const addFriend = async (userId, friendId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      friends: arrayUnion(friendId),
    });
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
};

export const removeFriend = async (userId, friendId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      friends: arrayRemove(friendId),
    });
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

export const getFriends = async (friendIds) => {
  try {
    if (!friendIds || friendIds.length === 0) return [];
    
    const friendsData = await Promise.all(
      friendIds.map(async (friendId) => {
        const friendSnap = await getDoc(doc(db, 'users', friendId));
        if (friendSnap.exists()) {
          return { id: friendSnap.id, ...friendSnap.data() };
        }
        return null;
      })
    );
    
    return friendsData.filter(Boolean);
  } catch (error) {
    console.error('Error getting friends:', error);
    throw error;
  }
};

// ============ GROUP OPERATIONS ============

export const createGroup = async (groupData) => {
  try {
    const groupRef = doc(collection(db, 'groups'));
    const groupId = groupRef.id;
    
    await setDoc(groupRef, {
      ...groupData,
      groupId,
      createdAt: new Date().toISOString(),
      members: [groupData.createdBy],
      challenges: [],
    });
    
    // Add group to user's groups
    const userRef = doc(db, 'users', groupData.createdBy);
    await updateDoc(userRef, {
      groups: arrayUnion(groupId),
    });
    
    return groupId;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const getGroup = async (groupId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    const groupSnap = await getDoc(groupRef);
    if (groupSnap.exists()) {
      return { id: groupSnap.id, ...groupSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting group:', error);
    throw error;
  }
};

export const joinGroup = async (groupId, userId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      members: arrayUnion(userId),
    });
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      groups: arrayUnion(groupId),
    });
  } catch (error) {
    console.error('Error joining group:', error);
    throw error;
  }
};

export const leaveGroup = async (groupId, userId) => {
  try {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      members: arrayRemove(userId),
    });
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      groups: arrayRemove(groupId),
    });
  } catch (error) {
    console.error('Error leaving group:', error);
    throw error;
  }
};

export const getUserGroups = async (groupIds) => {
  try {
    if (!groupIds || groupIds.length === 0) return [];
    
    const groupsData = await Promise.all(
      groupIds.map(async (groupId) => {
        const groupSnap = await getDoc(doc(db, 'groups', groupId));
        if (groupSnap.exists()) {
          return { id: groupSnap.id, ...groupSnap.data() };
        }
        return null;
      })
    );
    
    return groupsData.filter(Boolean);
  } catch (error) {
    console.error('Error getting user groups:', error);
    throw error;
  }
};

export const deleteGroup = async (groupId) => {
  try {
    await deleteDoc(doc(db, 'groups', groupId));
  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};

// ============ CHALLENGE OPERATIONS ============

export const createChallenge = async (challengeData) => {
  try {
    const challengeRef = doc(collection(db, 'challenges'));
    const challengeId = challengeRef.id;
    
    await setDoc(challengeRef, {
      ...challengeData,
      challengeId,
      createdAt: new Date().toISOString(),
      completedBy: [],
    });
    
    // Add challenge to group
    const groupRef = doc(db, 'groups', challengeData.groupId);
    await updateDoc(groupRef, {
      challenges: arrayUnion(challengeId),
    });
    
    return challengeId;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

export const getChallenge = async (challengeId) => {
  try {
    const challengeRef = doc(db, 'challenges', challengeId);
    const challengeSnap = await getDoc(challengeRef);
    if (challengeSnap.exists()) {
      return { id: challengeSnap.id, ...challengeSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting challenge:', error);
    throw error;
  }
};

export const getGroupChallenges = async (challengeIds) => {
  try {
    if (!challengeIds || challengeIds.length === 0) return [];
    
    const challengesData = await Promise.all(
      challengeIds.map(async (challengeId) => {
        const challengeSnap = await getDoc(doc(db, 'challenges', challengeId));
        if (challengeSnap.exists()) {
          return { id: challengeSnap.id, ...challengeSnap.data() };
        }
        return null;
      })
    );
    
    return challengesData.filter(Boolean);
  } catch (error) {
    console.error('Error getting group challenges:', error);
    throw error;
  }
};

export const completeChallenge = async (challengeId, userId) => {
  try {
    const challengeRef = doc(db, 'challenges', challengeId);
    await updateDoc(challengeRef, {
      completedBy: arrayUnion(userId),
    });
  } catch (error) {
    console.error('Error completing challenge:', error);
    throw error;
  }
};

export const deleteChallenge = async (challengeId, groupId) => {
  try {
    await deleteDoc(doc(db, 'challenges', challengeId));
    
    // Remove challenge from group
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      challenges: arrayRemove(challengeId),
    });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw error;
  }
};

// ============ LEADERBOARD OPERATIONS ============

export const updateLeaderboard = async (groupId, userId, points) => {
  try {
    const leaderboardRef = doc(db, 'leaderboard', groupId);
    const leaderboardSnap = await getDoc(leaderboardRef);
    
    if (leaderboardSnap.exists()) {
      const data = leaderboardSnap.data();
      const rankings = data.rankings || [];
      const userIndex = rankings.findIndex(r => r.userId === userId);
      
      if (userIndex >= 0) {
        rankings[userIndex].points += points;
        rankings[userIndex].challengesCompleted += 1;
      } else {
        rankings.push({
          userId,
          points,
          challengesCompleted: 1,
          rank: rankings.length + 1,
        });
      }
      
      // Sort by points and update ranks
      rankings.sort((a, b) => b.points - a.points);
      rankings.forEach((r, index) => {
        r.rank = index + 1;
      });
      
      await updateDoc(leaderboardRef, {
        rankings,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      await setDoc(leaderboardRef, {
        rankings: [{
          userId,
          points,
          challengesCompleted: 1,
          rank: 1,
        }],
        lastUpdated: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    throw error;
  }
};

export const getLeaderboard = async (groupId) => {
  try {
    const leaderboardRef = doc(db, 'leaderboard', groupId);
    const leaderboardSnap = await getDoc(leaderboardRef);
    if (leaderboardSnap.exists()) {
      return leaderboardSnap.data();
    }
    return { rankings: [], lastUpdated: null };
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

// ============ REAL-TIME LISTENERS ============

export const subscribeToUserProfile = (userId, callback) => {
  const userRef = doc(db, 'users', userId);
  return onSnapshot(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() });
    }
  });
};

export const subscribeToGroup = (groupId, callback) => {
  const groupRef = doc(db, 'groups', groupId);
  return onSnapshot(groupRef, (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() });
    }
  });
};

export const subscribeToLeaderboard = (groupId, callback) => {
  const leaderboardRef = doc(db, 'leaderboard', groupId);
  return onSnapshot(leaderboardRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    }
  });
};
