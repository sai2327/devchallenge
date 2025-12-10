import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MESSAGES } from '../utils/constants';

export const ProfileEdit = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userProfile, updateUserProfile, uploadProfilePhoto, loading } = useUser(currentUser?.uid);
  const { toasts, showToast, removeToast } = useToast();
  
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    phone: userProfile?.phone || '',
    bio: userProfile?.bio || '',
    codingProfiles: {
      leetcode: userProfile?.codingProfiles?.leetcode || '',
      codechef: userProfile?.codingProfiles?.codechef || '',
      hackerrank: userProfile?.codingProfiles?.hackerrank || '',
      codeforces: userProfile?.codingProfiles?.codeforces || '',
    },
  });
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('coding_')) {
      const platform = name.replace('coding_', '');
      setFormData({
        ...formData,
        codingProfiles: {
          ...formData.codingProfiles,
          [platform]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const result = await uploadProfilePhoto(file);
    setUploading(false);

    if (result.success) {
      showToast(MESSAGES.PHOTO_UPLOAD_SUCCESS, 'success');
    } else {
      showToast(result.error || 'Failed to upload photo', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const result = await updateUserProfile(formData);
    setSaving(false);

    if (result.success) {
      showToast(MESSAGES.PROFILE_UPDATE_SUCCESS, 'success');
      navigate('/profile');
    } else {
      showToast(result.error || 'Failed to update profile', 'error');
    }
  };

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
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Edit Profile
            </h1>

            <Card>
              <form onSubmit={handleSubmit}>
                {/* Photo Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover"
                  />
                  {uploading && <LoadingSpinner size="sm" className="mt-2" />}
                </div>

                <Input
                  label="Display Name"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Coding Profiles
                  </h3>
                  
                  <Input
                    label="LeetCode Username"
                    name="coding_leetcode"
                    value={formData.codingProfiles.leetcode}
                    onChange={handleChange}
                  />

                  <Input
                    label="CodeChef Username"
                    name="coding_codechef"
                    value={formData.codingProfiles.codechef}
                    onChange={handleChange}
                  />

                  <Input
                    label="HackerRank Username"
                    name="coding_hackerrank"
                    value={formData.codingProfiles.hackerrank}
                    onChange={handleChange}
                  />

                  <Input
                    label="CodeForces Username"
                    name="coding_codeforces"
                    value={formData.codingProfiles.codeforces}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={saving}
                  >
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/profile')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
