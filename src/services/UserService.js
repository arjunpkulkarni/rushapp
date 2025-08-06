import API from '../api/api';

const UserService = {
  createUser: (userData) => {
    return API.post('/users', userData);
  },
  getUser: (userId) => {
    return API.get(`/users/${userId}`);
  },
};

export default UserService;
