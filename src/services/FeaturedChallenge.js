import API from '../api/api';

export const getFeaturedChallenge = async (campusId) => {
  try {
    const response = await API.get('/challenges/featured', {
      params: { campus: campusId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured challenge:', error);
    throw error;
  }
};
