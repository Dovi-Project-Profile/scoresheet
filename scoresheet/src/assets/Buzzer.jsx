import buzzerSound from "./buzzer1.mp3";
import { useEffect, useRef } from "react";

const Alert = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current.muted = false;
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  return (
    <audio ref={audioRef} src={buzzerSound} autoPlay>
      <track kind="captions" />
    </audio>
  );
};

export default Alert;
