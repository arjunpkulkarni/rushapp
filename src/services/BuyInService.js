import API from '../api/api';

export const createBuyIn = async ({ campusId, date, amount = 1 }) => {
  const res = await API.post('/buyins', { campusId, date, amount });
  return res.data;
};

export const getBuyInStatus = async ({ campusId, date }) => {
  const params = new URLSearchParams();
  if (campusId) params.set('campusId', campusId);
  if (date) params.set('date', date);
  const res = await API.get(`/buyins/status?${params.toString()}`);
  return res.data;
};


