import { useChallenge } from '../store/useChallenge';
import { getChallenges } from '../services/ChallengeService';

let timer;

export const startFallbackPoller = () => {
  stopFallbackPoller();
  const poll = async () => {
    try {
      const list = await getChallenges();
      const now = Date.now();
      const current = list.find((c) => {
        const start = new Date(c.scheduledAt).getTime();
        const end = new Date(c.expiresAt).getTime();
        return now >= start && now < end;
      });
      if (current) useChallenge.getState().onDrop(current);
    } catch {}
  };
  timer = setInterval(poll, 15000);
  poll();
};

export const stopFallbackPoller = () => {
  if (timer) clearInterval(timer);
  timer = null;
};


