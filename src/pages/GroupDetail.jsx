import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { ChallengeCard } from '../components/ChallengeCard';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { useAuth } from '../hooks/useAuth';
import { useGroup } from '../hooks/useGroup';
import { useChallenges } from '../hooks/useChallenges';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MESSAGES } from '../utils/constants';

export const GroupDetail = () => {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const { group, members, loading: groupLoading } = useGroup(groupId);
  const { challenges, createChallenge, completeChallenge, deleteChallenge, loading: challengesLoading } = useChallenges(groupId);
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard(groupId);
  const { toasts, showToast, removeToast } = useToast();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    platform: 'leetcode',
    deadline: '',
    problemLink: '',
  });

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    const result = await createChallenge({
      ...formData,
      groupId,
      createdBy: currentUser.uid,
    });
    
    setCreating(false);

    if (result.success) {
      showToast(MESSAGES.CREATE_CHALLENGE_SUCCESS, 'success');
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        difficulty: 'medium',
        platform: 'leetcode',
        deadline: '',
        problemLink: '',
      });
      window.location.reload();
    } else {
      showToast(result.error || 'Failed to create challenge', 'error');
    }
  };

  const handleCompleteChallenge = async (challengeId) => {
    const result = await completeChallenge(challengeId, currentUser.uid, groupId);

    if (result.success) {
      showToast(MESSAGES.COMPLETE_CHALLENGE_SUCCESS, 'success');
      window.location.reload();
    } else {
      showToast(result.error || 'Failed to complete challenge', 'error');
    }
  };

  const handleDeleteChallenge = async (challengeId) => {
    if (!confirm('Are you sure you want to delete this challenge?')) return;
    
    const result = await deleteChallenge(challengeId, groupId);

    if (result.success) {
      showToast(MESSAGES.DELETE_CHALLENGE_SUCCESS, 'success');
      window.location.reload();
    } else {
      showToast(result.error || 'Failed to delete challenge', 'error');
    }
  };

  if (groupLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <main className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar - Group Info */}
          <aside className="col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {group?.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {group?.description}
              </p>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p>👥 {members?.length || 0} members</p>
                <p>🏆 {challenges?.length || 0} challenges</p>
              </div>
            </div>
          </aside>

          {/* Main Content - Challenges */}
          <div className="col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Challenges
              </h1>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create Challenge
              </Button>
            </div>

            {challengesLoading ? (
              <LoadingSpinner />
            ) : challenges && challenges.length > 0 ? (
              <div className="space-y-4">
                {challenges.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onComplete={handleCompleteChallenge}
                    onDelete={handleDeleteChallenge}
                    isCompleted={challenge.completedBy?.includes(currentUser.uid)}
                    isCreator={challenge.createdBy === currentUser.uid}
                    currentUserId={currentUser.uid}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                No challenges yet. Create one to get started!
              </div>
            )}
          </div>

          {/* Right Sidebar - Mini Leaderboard */}
          <aside className="col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Leaderboard
              </h3>
              {leaderboardLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <LeaderboardTable
                  leaderboard={leaderboard?.slice(0, 5) || []}
                  currentUserId={currentUser.uid}
                />
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* Create Challenge Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Challenge"
        size="lg"
      >
        <form onSubmit={handleCreateChallenge}>
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Platform
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="leetcode">LeetCode</option>
                <option value="codechef">CodeChef</option>
                <option value="hackerrank">HackerRank</option>
                <option value="codeforces">CodeForces</option>
              </select>
            </div>
          </div>

          <Input
            label="Deadline"
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
          />

          <Input
            label="Problem Link (Optional)"
            type="url"
            value={formData.problemLink}
            onChange={(e) => setFormData({ ...formData, problemLink: e.target.value })}
          />

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={creating}
            >
              Create
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};
