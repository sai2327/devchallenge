import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { TabNavigation } from '../components/TabNavigation';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { PLATFORMS } from '../utils/constants';

export const CodingStats = () => {
  const [activeTab, setActiveTab] = useState('leetcode');
  const [friendUsername, setFriendUsername] = useState('');

  const handleAddFriend = (e) => {
    e.preventDefault();
    // Add friend logic here
    setFriendUsername('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Coding Statistics
          </h1>

          <TabNavigation tabs={PLATFORMS} activeTab={activeTab} onChange={setActiveTab}>
            <Card>
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white capitalize">
                {activeTab} Stats
              </h2>

              {/* Add Friend Form */}
              <form onSubmit={handleAddFriend} className="mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder={`Enter ${activeTab} username`}
                    value={friendUsername}
                    onChange={(e) => setFriendUsername(e.target.value)}
                    containerClassName="mb-0 flex-1"
                  />
                  <Button type="submit" variant="primary">
                    Add Friend
                  </Button>
                </div>
              </form>

              {/* Friends List */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Friends
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No friends added for {activeTab} yet.
                </p>
              </div>
            </Card>
          </TabNavigation>
        </main>
      </div>

      <Footer />
    </div>
  );
};
