import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API = axios.create({
  baseURL: 'https://exemplary-charm-production.up.railway.app/api/v1',
});

API.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

export default API;
