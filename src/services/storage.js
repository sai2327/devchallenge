import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

// Upload profile photo
export const uploadProfilePhoto = async (userId, file) => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${userId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `profile-photos/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
};

// Delete file from storage
export const deleteFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Upload group avatar
export const uploadGroupAvatar = async (groupId, file) => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `group_${groupId}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `group-avatars/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading group avatar:', error);
    throw error;
  }
};

// Upload challenge attachment
export const uploadChallengeAttachment = async (challengeId, file) => {
  try {
    const fileName = `${challengeId}_${file.name}`;
    const storageRef = ref(storage, `challenge-attachments/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading challenge attachment:', error);
    throw error;
  }
};

// Get file URL from storage path
export const getFileURL = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};
