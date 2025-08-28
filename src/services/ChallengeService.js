import API from '../api/api';

export const getChallenges = async () => {
  try {
    const response = await API.get('/challenges');
    return response.data;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
};

export const submitProof = async ({ challengeId, campusId, videoUri }) => {
  const form = new FormData();
  form.append('challengeId', challengeId);
  form.append('campusId', campusId);
  form.append('video', {
    uri: videoUri,
    name: 'proof.mp4',
    type: 'video/mp4',
  });
  const res = await API.post('/submissions', form);
  return res.data;
};

export const getChallengeStats = async (challengeId) => {
  const res = await API.get(`/challenges/${challengeId}/stats`);
  return res.data; // { verifiedCount }
};
