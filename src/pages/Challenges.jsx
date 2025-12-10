import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { GroupCard } from '../components/GroupCard';
import { useAuth } from '../hooks/useAuth';
import { useGroup } from '../hooks/useGroup';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MESSAGES } from '../utils/constants';

export const Challenges = () => {
  const { currentUser } = useAuth();
  const { userGroups, createGroup, joinGroup, leaveGroup, loading } = useGroup(null, currentUser?.uid);
  const { toasts, showToast, removeToast } = useToast();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
  });
  
  const [joinFormData, setJoinFormData] = useState({
    groupId: '',
  });

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    const result = await createGroup({
      ...createFormData,
      createdBy: currentUser.uid,
    });
    
    setCreating(false);

    if (result.success) {
      showToast(MESSAGES.CREATE_GROUP_SUCCESS, 'success');
      setShowCreateModal(false);
      setCreateFormData({ name: '', description: '' });
      window.location.reload();
    } else {
      showToast(result.error || 'Failed to create group', 'error');
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setJoining(true);
    
    const result = await joinGroup(joinFormData.groupId, currentUser.uid);
    
    setJoining(false);

    if (result.success) {
      showToast(MESSAGES.JOIN_GROUP_SUCCESS, 'success');
      setShowJoinModal(false);
      setJoinFormData({ groupId: '' });
      window.location.reload();
    } else {
      showToast(result.error || 'Failed to join group', 'error');
    }
  };

  const handleLeaveGroup = async (groupId) => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    
    const result = await leaveGroup(groupId, currentUser.uid);

    if (result.success) {
      showToast(MESSAGES.LEAVE_GROUP_SUCCESS, 'success');
      window.location.reload();
    } else {
      showToast(result.error || 'Failed to leave group', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Groups
            </h1>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
              >
                Create Group
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowJoinModal(true)}
              >
                Join Group
              </Button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner size="lg" />
          ) : userGroups && userGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  onLeave={handleLeaveGroup}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You haven't joined any groups yet.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                Create Your First Group
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Create Group Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Group"
      >
        <form onSubmit={handleCreateGroup}>
          <Input
            label="Group Name"
            value={createFormData.name}
            onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
            required
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={createFormData.description}
              onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

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

      {/* Join Group Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Join Group"
      >
        <form onSubmit={handleJoinGroup}>
          <Input
            label="Group ID"
            value={joinFormData.groupId}
            onChange={(e) => setJoinFormData({ groupId: e.target.value })}
            placeholder="Enter the group ID"
            required
          />

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowJoinModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={joining}
            >
              Join
            </Button>
          </div>
        </form>
      </Modal>

      <Footer />
    </div>
  );
};
