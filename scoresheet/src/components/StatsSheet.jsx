import { useState } from "react";
import "./StatsSheet.css";
import "../TimerStyle.css";
import "./buttonStyles.css";
import Alert from "../assets/Buzzer";

const headerColor = "#283344";
const foulBgColor = "#252e3f"

export default function StatSheet({
  teamName,
  onScoreChange,
  periodLock,
  onChangeBonusHome,
  onChangeBonusAway,
}) {
  const createEmptyRow = () => ({
    no: "",
    player: "",
    fouls: "",
    firstquarter: "",
    secquarter: "",
    thirdquarter: "",
    fourthquarter: "",
    total: "",
  });

  const [data, setData] = useState(Array.from({ length: 12 }, createEmptyRow));
  const [playBuzzer, setPlayBuzzer] = useState(false);

  const handleChange = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;

    if (
      ["firstquarter", "secquarter", "thirdquarter", "fourthquarter"].includes(
        field
      )
    ) {
      const parse = (str) =>
        str
          .split("")
          .map((c) => parseInt(c) || 0)
          .reduce((a, b) => a + b, 0);

      const q1 = parse(newData[index].firstquarter || "");
      const q2 = parse(newData[index].secquarter || "");
      const q3 = parse(newData[index].thirdquarter || "");
      const q4 = parse(newData[index].fourthquarter || "");

      newData[index].total = q1 + q2 + q3 + q4;
    }

    setData(newData);

    if (onScoreChange) {
      const teamTotal = newData.reduce(
        (sum, player) => sum + Number(player.total || 0),
        0
      );
      onScoreChange(teamTotal);
    }
  };

  const addPlayer = () => {
    if (data.length < 20) {
      setData([...data, createEmptyRow()]);
    }
  };

  const removePlayer = () => {
    if (data.length > 12) {
      setData(data.slice(0, -1));
    }
  };

  const exportToCSV = () => {
    if (confirm(`Export stats for ${teamName.toUpperCase()}?`)) {
        const headers = Object.keys(data[0]);
        const rows = data.map((row) =>
          headers.map((h) => JSON.stringify(row[h] ?? ""))
        );
        const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `statsheet_team_${teamName.toUpperCase()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            display: "flex",
            gap: "1rem",
          }}
        >
         
          <button id="GeneralBttn" style={{
            cursor: data.length >= 20 && "not-allowed",
          }}
            onClick={addPlayer} disabled={data.length >= 20} >
            Add Player
          </button>
         
          <button id="GeneralBttn" style={{
            cursor: data.length === 12 && "not-allowed",
          }}
          onClick={removePlayer} disabled={data.length <= 12}>
            Remove Player
          </button>
        </div>
        <h1
          style={{
            textTransform: "uppercase",
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          {teamName.toUpperCase()}
        </h1>
      </div>

      <div className="mainStatsContainer">
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: "collapse", marginBottom: "1rem"}}
        >
          <thead
            style={{
              position: "sticky",
              background: "#283344",
              top: 0,
              zIndex: 1,
            }}
          >
            <tr>
              <th rowSpan="2">No.</th>
              <th rowSpan="2">Player Name</th>
              <th rowSpan="2">Fouls</th>
              <th colSpan="4">Points</th>
              <th rowSpan="2">Total</th>
            </tr>
            <tr>
              <th>1st Q</th>
              <th>2nd Q</th>
              <th>3rd Q</th>
              <th>4th Q</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => {
              let lesthan = Number(row.fouls) >= 5;
              return (
                <tr
                  key={idx}
                  style={{
                    opacity: lesthan ? 0.6 : 1,
                    backgroundColor: lesthan ? "#ffb5b55a" : "transparent",
                  }}
                >
                  {Object.keys(row).map((field) => {
                    let inputWidth;
                    let thefontweight;
                    if (
                      [
                        "firstquarter",
                        "secquarter",
                        "thirdquarter",
                        "fourthquarter",
                      ].includes(field)
                    ) {
                      inputWidth = "100px";
                    } else if (field === "no") {
                      inputWidth = "30px";
                    } else if (field === "total" || field === "fouls") {
                      inputWidth = "40px";
                    } else {
                      inputWidth = "160px";
                      thefontweight = "bold";
                    }
                    return (
                      <td key={field}>
                        <input
                          disabled={
                            (field === "firstquarter" && periodLock >= 2) ||
                            (field === "secquarter" && periodLock >= 3) ||
                            (field === "thirdquarter" && periodLock >= 4)
                          }
                          style={{
                            width: inputWidth,
                            textTransform:
                              field === "player" ? "uppercase" : "none",
                            fontWeight: thefontweight,
                            borderRadius: "5px",
                          }}
                          min={field === "fouls" ? 0 : undefined}
                          max={field === "fouls" ? 5 : undefined}
                          value={row[field]}
                          onChange={(e) =>
                            handleChange(idx, field, e.target.value)
                          }
                          readOnly={field === "total"}
                          type={field === "fouls" && "number"}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, auto)",
          alignItems: "center",
        }}
      >
        <p>Players: {data.length} / 20</p>
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <table>
            <thead style={{ backgroundColor: headerColor }}>
              <tr>
                <th colSpan="4">Team Fouls</th>
              </tr>
              <tr>
                <th>1st Q</th>
                <th>2nd Q</th>
                <th>3rd Q</th>
                <th>4th Q</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: foulBgColor }}>
                {Array.from({ length: 4 }).map((_, quarterIdx) => (
                  <td key={`quarter-Q${quarterIdx + 1}`}>
                    {Array.from({ length: 5 }).map((_, foulIdx) => (
                      <input
                        key={`quarter-${quarterIdx}-foul-${foulIdx}`}
                        type="checkbox"
                        style={{
                          accentColor: foulIdx === 4 ? "red" : "",
                        }}
                        disabled={
                          (quarterIdx === 0 && periodLock >= 2) ||
                          (quarterIdx === 1 && periodLock >= 3) ||
                          (quarterIdx === 2 && periodLock >= 4)
                        }
                        onChange={(e) => {
                          if (foulIdx === 4 && e.target.checked) {
                            if (onChangeBonusHome) onChangeBonusHome(true);
                            if (onChangeBonusAway) onChangeBonusAway(true);
                          }
                          console.log(
                            `Team ${teamName.toUpperCase()} Quarter ${
                              quarterIdx + 1
                            } foul ${foulIdx + 1} `
                          );
                        }}
                      />
                    ))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <table style={{ width: "100%" }}>
            <thead style={{ backgroundColor: headerColor }}>
              <tr>
                <th colSpan="3">Time Outs</th>
              </tr>
              <tr>
                <th>1st half</th>
                <th>2nd half</th>
                <th>OT</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ backgroundColor: foulBgColor }}>
                {Array.from({ length: 3 }).map((_, halfIdx) => (
                  <td key={`half-to${halfIdx + 1}`}>
                    {Array.from({ length: halfIdx === 2 ? 1 : 2 }).map(
                      (_, toIdx) => (
                        <input
                          key={`to-${halfIdx}-to-${toIdx}`}
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked === true) {
                              setPlayBuzzer(true);
                              setTimeout(() => {
                                setPlayBuzzer(false);
                              }, 500);
                            }
                          }}
                        />
                      )
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <button id="GeneralBttn" style={{ height: "25px" }} onClick={exportToCSV}>
          Export CSV
        </button>
      </div>
      <Alert trigger={playBuzzer} />
    </div>
  );
}
