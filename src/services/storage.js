import { supabase } from './firebase';

// Upload profile photo
export const uploadProfilePhoto = async (userId, file) => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${userId}_${Date.now()}.${fileExtension}`;
    const filePath = `profile-photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }
};

// Delete file from storage
export const deleteFile = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (error) throw error;
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
    const filePath = `group-avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading group avatar:', error);
    throw error;
  }
};

// Upload challenge attachment
export const uploadChallengeAttachment = async (challengeId, file) => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `challenge_${challengeId}_${Date.now()}.${fileExtension}`;
    const filePath = `challenge-attachments/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading challenge attachment:', error);
    throw error;
  }
};

// Upload submission proof
export const uploadSubmissionProof = async (userId, challengeId, file) => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `submission_${userId}_${challengeId}_${Date.now()}.${fileExtension}`;
    const filePath = `submissions/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading submission proof:', error);
    throw error;
  }
};
