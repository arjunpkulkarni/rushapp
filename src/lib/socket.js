import io from 'socket.io-client';
import * as Haptics from 'expo-haptics';
import { useChallenge } from '../store/useChallenge';
import Constants from 'expo-constants';

let socket;

export const connectSocket = ({ campusId, userId }) => {
  const WS_URL = Constants.expoConfig?.extra?.WS_URL;
  socket = io(WS_URL, { transports: ['websocket'] });

  socket.on('connect', () => {
    socket.emit('join_campus', { campusId, userId });
  });

  socket.on('challenge_drop', (payload) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    useChallenge.getState().onDrop(payload);
  });

  socket.on('challenge_update', (payload) => {
    useChallenge.getState().onUpdate(payload);
  });

  socket.on('challenge_end', (payload) => {
    useChallenge.getState().onEnd(payload);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  try {
    if (socket && socket.connected) {
      socket.removeAllListeners();
      socket.disconnect();
    }
  } catch {}
  socket = undefined;
};


