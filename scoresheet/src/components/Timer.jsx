import { useEffect, useRef, useState } from "react";
import "../TimerStyle.css";
import "../App.css";
import Alert from "../assets/Buzzer";

const TimerCom = () => {
  const [inputTime, setInputTime] = useState("10:00");
  const [mainTimer, setMainTimer] = useState(600000); // Store time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [isTimeDone, setIsTimeDone] = useState(false);

  const [textshotClock, setTextshotClock] = useState("24");
  const [shotClockTime, setShotClockTime] = useState(24000);
  const [isShotClockRunning, setIsShotClockRunning] = useState(false);
  const [isShotClockDone, setIsShotClockDone] = useState(false);

  const mainTimerRef = useRef(null);
  const shotclockRef = useRef(null);
  const [buzzerPlay, setBuzzerPlay] = useState(false);

  // Function to format time (MM:SS or MM:SS:MS if < 60s)
  const formatMainTimer = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);

    if (milliseconds < 60000) {
      return `${String(seconds).padStart(2, "0")}`;
    } else {
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
        2,
        "0"
      )}`;
    }
  };

  const formatShotClock = (time) => {
    const seconds = Math.floor((time % 60000) / 1000);

    return `${String(seconds).padStart(2, 0)}`;
  };
  // Main Timer Countdown
  useEffect(() => {
    if (!isRunning || mainTimer <= 0) return;
    if (mainTimer <= shotClockTime) {
      setIsShotClockRunning(false);
    }
    mainTimerRef.current = setInterval(() => {
      setMainTimer((prev) => Math.max(prev - 1000, 0)); // Decrease by 1 second
    }, 1000);
    return () => clearInterval(mainTimerRef.current);
  }, [isRunning, mainTimer]);

  const handleShotClockChange = (e) => {
    setTextshotClock(e.target.value);
  };
  // Handle manual input (MM:SS format)
  const handleTimeChange = (e) => {
    setInputTime(e.target.value);
  };
  // Shot Clock Countdown
  useEffect(() => {
    if (!isShotClockRunning || shotClockTime <= 0) return;
    shotclockRef.current = setInterval(() => {
      setShotClockTime((prev) => Math.max(prev - 1000, 0));
      if (shotClockTime === 1000) {
        setIsRunning(false);
        setIsShotClockRunning(false);
      } // Decrease by 1 second
    }, 1000);

    return () => clearInterval(shotclockRef.current);
  }, [isShotClockRunning, shotClockTime]);

  // Convert MM:SS input to total milliseconds
  const applyManualTime = () => {
    const timeParts = inputTime.split(":");
    if (timeParts.length === 2) {
      const minutes = parseInt(timeParts[0]);
      const seconds = parseInt(timeParts[1]);

      if (
        !isNaN(minutes) &&
        !isNaN(seconds) &&
        minutes >= 0 &&
        seconds >= 0 &&
        seconds < 60
      ) {
        setMainTimer((minutes * 60 + seconds) * 1000);
      } else {
        alert("Invalid time format! Use MM:SS (e.g., 05:20)");
      }
    } else {
      alert("Invalid time format! Use MM:SS (e.g., 05:20)");
    }
  };

  const manualShotClock = () => {
    const clockPart = parseInt(textshotClock);
    if (!isNaN(clockPart)) setShotClockTime(clockPart * 1000);
  };

  const handleStartStop = () => {
    if (shotClockTime <= 0) {
      setShotClockTime(24000);
    }
    setIsRunning(!isRunning);
    setIsShotClockRunning(!isShotClockRunning);
    setIsTimeDone(true);
  };

  return (
    <div className="MainContainer">
      <div className="TimerDiv" style={{ gridColumn: "span 1" }}>
        <input
          style={{ backgroundColor: "rgb(20, 71, 0)" }}
          className="TeamName"
          value={"GAME CLOCK"}
          type="text"
        />
        {!isTimeDone ? (
          <input
            style={{ color: "rgb(172, 0, 0)" }}
            id="generalFont"
            className="Score"
            type="text"
            value={inputTime}
            onChange={handleTimeChange}
            disabled={isRunning} // Disable input while running
            placeholder="MM:SS"
          />
        ) : (
          <input
            style={{
              color: "rgb(0, 172, 29)",
              textAlign: "center",
            }}
            id="generalFont"
            className="Score"
            type="text"
            value={formatMainTimer(mainTimer)}
            readOnly
          />
        )}
      </div>
      <div className="ShootClockCon" style={{ gridColumn: "span 1" }}>
        {isShotClockDone ? (
          <input
            style={{
              color: "rgb(89, 219, 77)",
              textAlign: "center",
              textShadow: "2px 2px rgb(90, 90, 90)",
            }}
            id="generalFont"
            className="ShotClockTimer"
            type="text"
            value={textshotClock}
            onChange={handleShotClockChange}
            // disabled={isShotClockRunning}
          />
        ) : (
          <input
            style={{
              color:
                shotClockTime <= 10000 ? "rgb(255, 0, 0)" : "rgb(224, 134, 48)",
              textAlign: "center",
              textShadow: "1px 1px rgb(37, 37, 37)",
            }}
            id="generalFont"
            className="ShotClockTimer"
            type="text"
            value={
              mainTimer > shotClockTime ? formatShotClock(shotClockTime) : ":"
            }
            readOnly
          />
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gridColumn: "span 1",
          gap: "10px",
        }}
      >
        <button
          id="TimerBttn"
          style={{
            cursor: isRunning && "not-allowed",
          }}
          onClick={() => {
            setIsTimeDone(!isTimeDone);
            applyManualTime();
          }}
          disabled={isRunning} // Only allow setting time when not running
        >
          Set Time
        </button>
        <button
          id="TimerBttn"
          style={{
            cursor: !isTimeDone && "not-allowed",
          }}
          disabled={!isTimeDone}
          onClick={() => {
            handleStartStop();
          }}
        >
          {isRunning ? <p>Stop</p> : <p>Start</p>}
        </button>
        <button
          id="TimerBttn"
          onClick={() => {
            setBuzzerPlay((prev) => !prev);
            // setTimeout(() => setBuzzerPlay(false), 500);
          }}
        >
          Buzzer
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gridColumn: "span 1",
          gap: "10px",
        }}
      >
        <button
          id="TimerBttn"
          onClick={() => {
            setIsShotClockRunning(!isShotClockRunning);
            setIsShotClockDone(false);
          }}
          disabled={isShotClockDone}
        >
          {isShotClockRunning ? "||" : ">"}
        </button>
        <button
          id="TimerBttn"
          onClick={() => {
            setIsShotClockDone(!isShotClockDone);
            manualShotClock();
          }}
          disabled={isShotClockRunning}
        >
          Set
        </button>
        <button
          id="TimerBttn"
          onClick={() => {
            setShotClockTime(14000);
          }}
        >
          14
        </button>
        <button
          id="TimerBttn"
          onClick={() => {
            setShotClockTime(24000);
          }}
        >
          24
        </button>
      </div>
      <Alert trigger={shotClockTime <= 0 || mainTimer <= 0} />
      <Alert trigger={buzzerPlay} />
    </div>
  );
};

export default TimerCom;
