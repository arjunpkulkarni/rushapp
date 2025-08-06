import API from '../api/api';

export const getChallenges = async (campusId) => {
  try {
    const response = await API.get('/challenges', {
      params: { campus: campusId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
};
