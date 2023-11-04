import { useEffect, useState } from 'react';

export function useFrameTime() {
  const [frameTime, setFrameTime] = useState(0);

  useEffect(() => {
    let frameId: number;
    let elapsed = Date.now();

    function frame() {
      const now = Date.now();

      setFrameTime(now - elapsed);
      frameId = requestAnimationFrame(frame);

      elapsed = now;
    }

    requestAnimationFrame(frame);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return frameTime;
}
