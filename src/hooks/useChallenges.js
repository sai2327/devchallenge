import { useState, useEffect } from 'react';
import * as db from '../services/db';

export const useChallenges = (groupId = null) => {
  const [challenges, setChallenges] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const groupData = await db.getGroup(groupId);
        
        if (groupData?.challenges && groupData.challenges.length > 0) {
          const challengesData = await db.getGroupChallenges(groupData.challenges);
          setChallenges(challengesData);
          
          // Filter active challenges (not expired)
          const active = challengesData.filter(
            (challenge) => new Date(challenge.deadline) > new Date()
          );
          setActiveChallenges(active);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching challenges:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [groupId]);

  const createChallenge = async (challengeData) => {
    try {
      const challengeId = await db.createChallenge(challengeData);
      return { success: true, challengeId };
    } catch (error) {
      console.error('Error creating challenge:', error);
      return { success: false, error: error.message };
    }
  };

  const completeChallenge = async (challengeId, userId, groupId) => {
    try {
      await db.completeChallenge(challengeId, userId);
      
      // Update leaderboard
      const challenge = challenges.find((c) => c.id === challengeId);
      let points = 10; // Default points
      
      if (challenge?.difficulty === 'easy') points = 10;
      if (challenge?.difficulty === 'medium') points = 20;
      if (challenge?.difficulty === 'hard') points = 30;
      
      await db.updateLeaderboard(groupId, userId, points);
      
      return { success: true };
    } catch (error) {
      console.error('Error completing challenge:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteChallenge = async (challengeId, groupId) => {
    try {
      await db.deleteChallenge(challengeId, groupId);
      return { success: true };
    } catch (error) {
      console.error('Error deleting challenge:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    challenges,
    activeChallenges,
    loading,
    error,
    createChallenge,
    completeChallenge,
    deleteChallenge,
  };
};
