import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatDate } from '../utils/formatters';

export const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userProfile, loading } = useUser(currentUser?.uid);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <Card>
              <div className="flex items-start gap-8">
                {/* Profile Picture and Basic Info */}
                <div className="flex flex-col items-center">
                  <Avatar
                    src={userProfile?.photoURL}
                    name={userProfile?.displayName}
                    size="2xl"
                    className="mb-4"
                  />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {userProfile?.displayName || 'Anonymous User'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {userProfile?.email}
                  </p>
                  {userProfile?.userId && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 font-mono mb-4">
                      ID: {userProfile.userId}
                    </p>
                  )}
                  <Button
                    variant="primary"
                    onClick={() => navigate('/profile/edit')}
                  >
                    Edit Profile
                  </Button>
                </div>

                {/* Profile Details */}
                <div className="flex-1">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      About
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {userProfile?.bio || 'No bio added yet.'}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Contact
                    </h3>
                    {userProfile?.phone && (
                      <p className="text-gray-600 dark:text-gray-400">
                        📱 {userProfile.phone}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Coding Profiles
                    </h3>
                    <div className="space-y-2">
                      {userProfile?.codingProfiles?.leetcode && (
                        <p className="text-gray-600 dark:text-gray-400">
                          🔷 LeetCode: {userProfile.codingProfiles.leetcode}
                        </p>
                      )}
                      {userProfile?.codingProfiles?.codechef && (
                        <p className="text-gray-600 dark:text-gray-400">
                          👨‍🍳 CodeChef: {userProfile.codingProfiles.codechef}
                        </p>
                      )}
                      {userProfile?.codingProfiles?.hackerrank && (
                        <p className="text-gray-600 dark:text-gray-400">
                          💚 HackerRank: {userProfile.codingProfiles.hackerrank}
                        </p>
                      )}
                      {userProfile?.codingProfiles?.codeforces && (
                        <p className="text-gray-600 dark:text-gray-400">
                          🔴 CodeForces: {userProfile.codingProfiles.codeforces}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Member since {formatDate(userProfile?.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
