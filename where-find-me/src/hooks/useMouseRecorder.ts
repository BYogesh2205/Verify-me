import { useState, useRef, useCallback, useEffect } from 'react';
import { MousePoint } from '../types';

export function useMouseRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const recordedPointsRef = useRef<MousePoint[]>([]);

  const startRecording = useCallback(() => {
    recordedPointsRef.current = [];
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback((): MousePoint[] => {
    setIsRecording(false);
    return [...recordedPointsRef.current];
  }, []);

  const clearRecording = useCallback(() => {
    recordedPointsRef.current = [];
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isRecording) return;
      recordedPointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        t: performance.now(),
      });
    };

    window.addEventListener('mousemove', handleMove);
    return () => {
      window.removeEventListener('mousemove', handleMove);
    };
  }, [isRecording]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    clearRecording,
    recordedPointsRef,
  };
}
