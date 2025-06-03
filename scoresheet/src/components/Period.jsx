import { useState } from "react";

export const Period = ({ onPeriodChange }) => {
  const [period, setPeriod] = useState(1);
  const [periodText, setPeriodText] = useState("PERIOD");
  const [ballLeftOrRight, setBallLeftOrRight] = useState(false);

  const handlePeriodChange = (newPeriod) => {
    if (newPeriod === "add") {
      setPeriod(period + 1);
      onPeriodChange(period + 1);
    } else if (newPeriod === "minus") {
      setPeriod(period - 1);
      onPeriodChange(period - 1);
    }
  };
  return (
    <div className="PeriodWrapper">
      <div className="PeriodDiv">
        <input
          className="inputPeriod"
          type="text"
          value={periodText}
          onChange={(e) => setPeriodText(e.target.value)}
        />
        <input
          style={{
            backgroundColor: "rgb(224, 134, 48)",
            color: "white",
            fontSize: "32px",
            fontWeight: "600",
          }}
          className="Score"
          value={period}
          type="text"
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              // Allows only numbers (empty string is okay for backspace)
              setPeriod(value === "" ? "" : parseInt(value, 10));
            }
          }}
        />
        <button
          className="bttnArrow"
          onClick={() => {
            setBallLeftOrRight(!ballLeftOrRight);
          }}
        >
          {ballLeftOrRight ? "<==" : "==>"}
        </button>
      </div>
      <div className="DivBttn" id="periodid">
        <button
          className="Bttn1"
          onClick={() => {
            if (period !== 1) {
              handlePeriodChange("minus");
            }
          }}
        >
          -
        </button>
        <button
          className="Bttn1"
          onClick={() => {
            if (period !== 9) {
              handlePeriodChange("add");
            }
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};
