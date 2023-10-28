import { useEffect, useState } from 'react';

export function useFrameTime() {
  const [frameTime, setFrameTime] = useState(performance.now());

  useEffect(() => {
    let frameId: number;

    function frame(time: number) {
      setFrameTime(time);
      frameId = requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return frameTime;
}
