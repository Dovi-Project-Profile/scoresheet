import { useRef, useState, useEffect } from "react";

const TestTimer = () => {
  const startTimeRef = useRef(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = performance.now(); // High precision timestamp

    const update = () => {
      setTimeElapsed(performance.now() - startTimeRef.current);
      animationFrameRef.current = requestAnimationFrame(update);
    };

    animationFrameRef.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  return <div>Elapsed time: {timeElapsed.toFixed(3)} ms</div>;
};

export default TestTimer;
