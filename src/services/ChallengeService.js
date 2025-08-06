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
