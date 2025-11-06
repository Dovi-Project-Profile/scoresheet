import { useEffect, useState } from "react";
import TimerCom from "../components/Timer";
import { Period } from "../components/Period";
import StatSheet from "../components/StatsSheet";
import { fetchPlayers } from "../components/admin-page/fetchFunctions";
const awayColor = "rgb(63, 121, 247)";
const homeColor = "rgb(247, 63, 63)";
export const Scoreboard = () => {
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [thePeriod, setthePeriod] = useState(1);
  const [bonusHome, setBonusHome] = useState(false);
  const [bonusAway, setBonusAway] = useState(false);
  const [teamOptions, setTeamOptions] = useState([]);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [teamInfoA, setTeamInfoA] = useState({});
  const [teamInfoH, setTeamInfoH] = useState({});
  const [playersListA, setPlayersListA] = useState([]);
  const [playersListH, setPlayersListH] = useState([]);

  const [userInfo, setUserInfo] = useState(null);

  // const userChecker = () => {
  //   if (!userInfo) {
  //     console.log("No user found");
  //   } else {
  //     console.log("User Found");
  //   }
  // };

  useEffect(() => {
    // check current stored session
    try {
      const storedUser = localStorage.getItem("sessionUser");
      if (storedUser) setUserInfo(JSON.parse(storedUser));
      console.log("Ignore for a while", userInfo);
    } catch (err) {
      console.error("Invalid session in storage:", err);
      setUserInfo(null);
    }
  }, []);

  useEffect(() => {
    try {
      const teamList = localStorage.getItem("teamsList");
      if (teamList) setTeamOptions(JSON.parse(teamList));
    } catch (err) {
      console.error("Invalid team list in storage:", err);
      setTeamOptions([]);
    }
  }, []);

  const playersA = async () => {
    if (!awayTeam || !userInfo) return;
    let res = await fetchPlayers({ team: teamInfoA?.team_id });
    setPlayersListA(res || []);
  };
  useEffect(() => {
    playersA();
  }, [teamInfoA]);
  const playersH = async () => {
    if (!homeTeam || !userInfo) return;
    let res = await fetchPlayers({ team: teamInfoH?.team_id });
    setPlayersListH(res || []);
  };
  useEffect(() => {
    playersH();
  }, [teamInfoH]);

  const homeBttnJSX = (
    <div className="DivBttn" id="home">
      <button
        className="Bttn1"
        onClick={() => {
          if (homeScore >= 1) setHomeScore(homeScore - 1);
        }}>
        -
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setHomeScore(homeScore + 1);
        }}>
        1
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setHomeScore(homeScore + 2);
        }}>
        2
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setHomeScore(homeScore + 3);
        }}>
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
        }}>
        -
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setAwayScore(awayScore + 1);
        }}>
        1
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setAwayScore(awayScore + 2);
        }}>
        2
      </button>
      <button
        className="Bttn1"
        onClick={() => {
          setAwayScore(awayScore + 3);
        }}>
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
              placeholder="Select/Type team"
              onClick={() => {
                setHomeTeam(""); // this is to trigger and clearing the value of state
              }}
              onChange={(e) => {
                setHomeTeam(e.target.value);
                const teamA = teamOptions?.find(
                  (t) => t.team_name === e.target.value
                );
                setTeamInfoH(teamA);
              }}
              list="teamOptions"
            />
            <datalist id="teamOptions">
              {teamOptions?.map((t) => (
                <option key={t.team_id} value={t.team_name} />
              ))}
            </datalist>
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
            <div>
              <label className="container">
                <b style={{ paddingRight: "5px" }}>{"BONUS"}</b>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setBonusHome(e.target.checked);
                  }}
                  checked={bonusHome}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>
          <div className="BttnConJSX">{homeBttnJSX}</div>
        </div>
        <Period onPeriodChange={setthePeriod} />
        <div className="MainDiv">
          <div className="TeamNameDiv">
            <input
              style={{ backgroundColor: `${awayColor}` }}
              className="TeamName"
              value={awayTeam}
              type="text"
              placeholder="Select/Type team"
              onClick={() => {
                setAwayTeam("");
              }}
              onChange={(e) => {
                setAwayTeam(e.target.value);
                const teamH = teamOptions?.find(
                  (t) => t.team_name === e.target.value
                );
                setTeamInfoA(teamH);
              }}
              list="teamOptions"
            />
            <datalist id="teamOptions">
              {teamOptions?.map((t) => (
                <option key={t.team_id} value={t.team_name} />
              ))}
            </datalist>
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
            <div>
              <label className="container">
                <b style={{ paddingRight: "5px" }}>{"BONUS"}</b>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setBonusAway(e.target.checked);
                  }}
                  checked={bonusAway}
                />
                <span className="checkmark" />
              </label>
            </div>
          </div>
          <div className="BttnConJSX">{awayBttnJSX}</div>
        </div>
      </div>
      <div className="statsDiv">
        <div className="statsSheetDiv">
          <StatSheet
            playersList={playersListH}
            teamName={homeTeam}
            onScoreChange={setHomeScore}
            periodLock={thePeriod}
            onChangeBonusHome={setBonusHome}
          />
        </div>
        <div className="statsSheetDiv">
          <StatSheet
            playersList={playersListA}
            teamName={awayTeam}
            onScoreChange={setAwayScore}
            periodLock={thePeriod}
            onChangeBonusAway={setBonusAway}
          />
        </div>
      </div>
    </div>
  );
};
