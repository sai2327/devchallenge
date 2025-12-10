import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { useAuth } from '../hooks/useAuth';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useGroup } from '../hooks/useGroup';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { formatDateTime } from '../utils/formatters';

export const Leaderboard = () => {
  const { groupId } = useParams();
  const { currentUser } = useAuth();
  const { group } = useGroup(groupId);
  const { leaderboard, loading, page, setPage, getPaginatedLeaderboard } = useLeaderboard(groupId);

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
      
      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {group?.name} Leaderboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {formatDateTime(new Date())}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <LeaderboardTable
            leaderboard={leaderboard}
            currentUserId={currentUser?.uid}
            showPagination={true}
            page={page}
            pageSize={20}
            onPageChange={setPage}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};
