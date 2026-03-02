import buzzerSound from "./buzzer1.mp3";
import { useEffect, useRef } from "react";
import PropTypes from 'prop-types';

const Alert = ({ trigger }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (trigger) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  }, [trigger]);

  return (
    <audio ref={audioRef} src={buzzerSound}>
      <track kind="captions" />
    </audio>
  );
};

Alert.propTypes  = {
  trigger: PropTypes.func.isRequired,
}

export default Alert;
