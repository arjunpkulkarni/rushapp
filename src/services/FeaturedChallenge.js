import API from '../api/api';

export const getFeaturedChallenge = async () => {
  try {
    const response = await API.get('/challenges/featured');
    return response.data;
  } catch (error) {
    console.error('Error fetching featured challenge:', error);
    throw error;
  }
};
