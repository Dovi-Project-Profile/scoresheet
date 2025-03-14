import { useState } from "react";
import "./App.css";
import TimerCom from "./components/Timer";
import { Period } from "./components/Period";
import TestTimer from "./assets/TestTime";
const awayColor = "rgb(63, 121, 247)";
const homeColor = "rgb(247, 63, 63)";
function App() {
  const [homeTeam, setHomeTeam] = useState("HOME");
  const [awayTeam, setAwayTeam] = useState("AWAY");
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);

  const homeBttnJSX = (
    <div className="DivBttn" id="home">
      <button
        className="Bttn1"
        onClick={() => {
          if (homeScore >= 1) setHomeScore(homeScore - 1);
        }}
      >
        -
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setHomeScore(homeScore + 1);
        }}
      >
        1
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setHomeScore(homeScore + 2);
        }}
      >
        2
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setHomeScore(homeScore + 3);
        }}
      >
        3
      </button>
    </div>
  );

  const awayBttnJSX = (
    <div className="DivBttn" id="away">
      <button
        className="Bttn1"
        onClick={() => {
          if (awayScore >= 1) setAwayScore(awayScore - 1);
        }}
      >
        -
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setAwayScore(awayScore + 1);
        }}
      >
        1
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setAwayScore(awayScore + 2);
        }}
      >
        2
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setAwayScore(awayScore + 3);
        }}
      >
        3
      </button>
    </div>
  );

  return (
    <div className="App">
      <div className="ScoreWrapper">
        <TimerCom />
        <div className="MainDiv">
          <div className="TeamNameDiv">
            <input
              style={{ backgroundColor: `${homeColor}` }}
              className="TeamName"
              value={homeTeam}
              type="text"
              onChange={(e) => setHomeTeam(e.target.value)}
            />
            <input
              style={{ color: `${homeColor}` }}
              id="generalFont"
              className="Score"
              value={homeScore}
              type="text"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setHomeScore(value === "" ? "" : parseInt(value, 10));
                }
              }}
            />
            <div
              style={{
                width: "100%",
              }}
            >
              <label className="container">
                {"BONUS."}
                <input type="checkbox" />
                <span className="checkmark" />
              </label>
            </div>
          </div>
          <div className="BttnConJSX">{homeBttnJSX}</div>
        </div>
        <Period />
        <div className="MainDiv">
          <div className="TeamNameDiv">
            <input
              style={{ backgroundColor: `${awayColor}` }}
              className="TeamName"
              value={awayTeam}
              type="text"
              onChange={(e) => setAwayTeam(e.target.value)}
            />
            <input
              style={{ color: `${awayColor}` }}
              id="generalFont"
              className="Score"
              value={awayScore}
              type="text"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setAwayScore(value === "" ? "" : parseInt(value, 10));
                }
              }}
            />
            <div
              style={{
                width: "100%",
              }}
            >
              <label className="container">
                {"BONUS."}
                <input type="checkbox" />
                <span className="checkmark" />
              </label>
            </div>
          </div>
          <div className="BttnConJSX">{awayBttnJSX}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
