import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export function useTimer(duration: number, onComplete: () => void) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    console.log('Timer effect running:', { isActive, timeLeft });

    if (!isActive) {
      console.log('Timer is paused, not starting interval');
      return;
    }

    if (timeLeft <= 0) {
      console.log('Timer complete, calling onComplete');
      onCompleteRef.current();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1000;
        console.log('Timer tick:', prev, '->', next);
        return next;
      });
    }, 1000);

    return () => {
      console.log('Cleaning up timer interval');
      clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const pause = useCallback(() => {
    console.log('Timer: pause() called, setting isActive to false');
    setIsActive(false);
  }, []);

  const resume = useCallback(() => {
    console.log('Timer: resume() called, setting isActive to true');
    setIsActive(true);
  }, []);

  const reset = useCallback(() => {
    console.log('Timer: reset() called');
    setTimeLeft(duration);
    setIsActive(true);
  }, [duration]);

  return useMemo(
    () => ({ timeLeft, isActive, pause, resume, reset }),
    [timeLeft, isActive, pause, resume, reset]
  );
}