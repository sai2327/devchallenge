import { useState, useEffect } from 'react';
import * as db from '../services/db';

export const useLeaderboard = (groupId) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await db.getLeaderboard(groupId);
        
        if (data?.rankings) {
          setLeaderboard(data.rankings);
          setTotal(data.rankings.length);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();

    // Subscribe to real-time updates
    const unsubscribe = db.subscribeToLeaderboard(groupId, (data) => {
      if (data?.rankings) {
        setLeaderboard(data.rankings);
        setTotal(data.rankings.length);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [groupId]);

  const getUserRank = (userId) => {
    const userRanking = leaderboard.find((r) => r.userId === userId);
    return userRanking?.rank || null;
  };

  const getPaginatedLeaderboard = (pageSize = 20) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return leaderboard.slice(startIndex, endIndex);
  };

  return {
    leaderboard,
    currentUserRank,
    loading,
    error,
    page,
    setPage,
    total,
    getUserRank,
    getPaginatedLeaderboard,
  };
};
