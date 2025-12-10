import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { StatCard } from '../components/StatCard';
import { ChallengeCard } from '../components/ChallengeCard';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useChallenges } from '../hooks/useChallenges';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const Home = () => {
  const { currentUser } = useAuth();
  const { userProfile, loading: userLoading } = useUser(currentUser?.uid);
  const { activeChallenges, loading: challengesLoading } = useChallenges();

  if (userLoading) {
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
          {/* Hero Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {userProfile?.displayName || 'Developer'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Ready to tackle some challenges today?
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<span className="text-2xl">🏆</span>}
              label="Total Points"
              value={userProfile?.totalPoints || 0}
              color="primary"
            />
            <StatCard
              icon={<span className="text-2xl">✅</span>}
              label="Completed Challenges"
              value={userProfile?.completedChallenges || 0}
              color="success"
            />
            <StatCard
              icon={<span className="text-2xl">👥</span>}
              label="Friends"
              value={userProfile?.friends?.length || 0}
              color="warning"
            />
            <StatCard
              icon={<span className="text-2xl">🎯</span>}
              label="Active Groups"
              value={userProfile?.groups?.length || 0}
              color="error"
            />
          </div>

          {/* Active Challenges */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Active Challenges
            </h2>
            {challengesLoading ? (
              <LoadingSpinner />
            ) : activeChallenges && activeChallenges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeChallenges.slice(0, 4).map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    currentUserId={currentUser?.uid}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No active challenges. Join a group to get started!
              </p>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
