import API from '../api/api';

const UserService = {
  createUser: (userData) => {
    return API.post('/users', userData);
  },
  getUser: (userId) => {
    return API.get(`/users/${userId}`);
  },
  getMe: () => {
    return API.get('/users/me');
  },
};

export default UserService;
