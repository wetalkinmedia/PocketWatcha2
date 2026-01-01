import { useState, useEffect, useCallback, useMemo } from 'react';

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

  const pause = useCallback(() => {
    console.log('Timer: pause() called, setting isActive to false');
    setIsActive(false);
  }, []);
  const resume = useCallback(() => {
    console.log('Timer: resume() called, setting isActive to true');
    setIsActive(true);
  }, []);
  const reset = useCallback(() => {
    setTimeLeft(duration);
    setIsActive(true);
  }, [duration]);

  return useMemo(() => ({
    timeLeft,
    isActive,
    pause,
    resume,
    reset
  }), [timeLeft, isActive, pause, resume, reset]);
}