import buzzerSound from "./buzzer1.mp3";
import { useEffect, useRef } from "react";

const Alert = ({ trigger }) => {
  const audioRef = useRef(null);
  console.log(trigger);

  useEffect(() => {
    if (trigger) {
      // audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, [trigger]);

  return (
    <audio ref={audioRef} src={buzzerSound}>
      <track kind="captions" />
    </audio>
  );
};

export default Alert;
