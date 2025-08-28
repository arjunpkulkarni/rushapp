import React, { useEffect, useState } from 'react';
import { StyledText } from './StyledText';

export default function Countdown({ target, prefix = '', style }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = new Date(target).getTime() - now;
  if (ms <= 0) return <StyledText style={style}>{prefix}Expired</StyledText>;
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return <StyledText style={style}>{prefix}{h}:{m}:{s}</StyledText>;
}


