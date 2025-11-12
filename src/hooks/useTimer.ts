import { useState, useEffect } from 'react';

export function useTimer(duration: number, onComplete: () => void) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) {
      if (timeLeft <= 0) {
        onComplete();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const pause = () => setIsActive(false);
  const resume = () => setIsActive(true);
  const reset = () => {
    setTimeLeft(duration);
    setIsActive(true);
  };

  return { timeLeft, isActive, pause, resume, reset };
}