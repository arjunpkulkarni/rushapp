import API from '../api/api';

const UserService = {
  createUser: (userData) => {
    return API.post('/users', userData);
  },
  completeUser: (userData) => {
    return API.post('/users/complete', userData);
  },
  updateProfileImage: (profileImage) => {
    return API.put('/users/me/profile-image', { profileImage });
  },
  getUser: (userId) => {
    return API.get(`/users/${userId}`);
  },
  getMe: () => {
    return API.get('/users/me');
  },
};

export default UserService;
