import { create } from 'zustand';
import { produce } from 'immer';

// Phases: idle | armed | live | cooldown | results
export const useChallenge = create((set, get) => ({
  phase: 'idle',
  current: null,
  serverTimeOffsetMs: 0,
  lastEventId: null,

  setServerTime: (serverTime) => {
    const offset = new Date(serverTime).getTime() - Date.now();
    set({ serverTimeOffsetMs: offset });
  },

  onDrop: (payload) => set(produce((s) => {
    s.current = payload;
    s.phase = 'live';
  })),
  onUpdate: (u) => set(produce((s) => {
    if (!s.current) return;
    Object.assign(s.current, u);
  })),
  onEnd: (e) => set(produce((s) => {
    if (s.current && s.current.id === e.id) {
      s.phase = 'results';
    }
  })),
}));


