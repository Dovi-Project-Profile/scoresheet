import { useEffect, useRef, useState } from "react";

export const AutoLogout = ({ handleLogout }) => {
  const inActive = 15; // inactivity delay before showing modal 15mins
  const multiplier = 60000;
  const timeout = inActive * multiplier;
  const countdownTime = 10; // countdown seconds
  const [showPrompt, setShowPrompt] = useState(false);
  const [countdown, setCountdown] = useState(countdownTime);
  const countdownRef = useRef(null);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowPrompt(true); // show modal
      setCountdown(countdownTime);
      startCountdown(); // start countdown
    }, timeout);
  };

  const startCountdown = () => {
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          handleLogout(); // auto logout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stayLoggedIn = () => {
    clearInterval(countdownRef.current);
    setShowPrompt(false);
    startTimer(); // restart inactivity timer
  };

  useEffect(() => {
    startTimer();

    const resetTimer = () => {
      clearTimeout(timerRef.current);
      startTimer();
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    return () => {
      clearTimeout(timerRef.current);
      clearInterval(countdownRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [handleLogout]);

  return (
    <>
      {showPrompt && (
        <div
          style={{
            fontSize: "18px",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            flexDirection: "column",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#141a27",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <b>
              Auto logout in{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>
                {countdown}
              </span>{" "}
              {countdown <= 1 ? "second" : "seconds"}
            </b>
            <p>Your session will expire soon. Stay logged in?</p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
              }}
            >
              <button id="GeneralBttn" onClick={stayLoggedIn}>
                Stay Logged In
              </button>
              <button id="GeneralBttn" onClick={handleLogout}>
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
