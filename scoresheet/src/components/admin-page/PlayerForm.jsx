import { useEffect, useState } from "react";
import "./AdminStyles.css";
import {
  fetchCitiesMunicipalities,
  fetchPlayers,
  fetchPlayerStats,
} from "./fetchFunctions";
import { supabase } from "../../supabaseClient";
import { useDebouncer } from "../../hooks/useDebouncer";

export const PlayerForm = ({ teams }) => {
  const INITIAL_PLAYER_INFO = {
    player_id: null,
    first_name: "",
    middle_name: "",
    last_name: "",
    jersey_number: "",
    position: "",
    birthdate: "",
    height_cm: "",
    weight_kg: "",
    team_id: null,
    age: "",
    hometown: "",
  };
  const [cities, setCities] = useState([]);
  const [playerInfo, setPlayerInfo] = useState(INITIAL_PLAYER_INFO);
  const [players, setPlayers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [mode, setMode] = useState("view"); // view, edit, new
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCitiesMunicipalities().then(setCities).catch(console.error);
  }, []);

  const playersList = async () => {
    let res = await fetchPlayers();
    setPlayers(res || []);
  };
  useEffect(() => {
    playersList();
  }, []);

  const cancelRes = () => {
    const reset = () => {
      setPlayerInfo(INITIAL_PLAYER_INFO);
      setSelectedRow(null);
      setMode("view");
    };
    if (mode !== "view") {
      if (confirm("Are you sure you want to proceed?")) reset();
    } else {
      reset();
    }
  };

  const handleChangeForm = (key, value) => {
    setPlayerInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handlePlayerInfo = (elem, index) => {
    setSelectedRow(index);
    setPlayerInfo(elem);
  };

  const handleEditPlayer = async () => {
    if (mode === "view") return;
    try {
      const { error } = await supabase
        .from("tbl_local_players")
        .update({
          first_name: playerInfo.first_name,
          middle_name: playerInfo.middle_name,
          last_name: playerInfo.last_name,
          jersey_number: playerInfo.jersey_number,
          position: playerInfo.position,
          birthdate: playerInfo.birthdate,
          height_cm: playerInfo.height_cm,
          weight_kg: playerInfo.weight_kg,
          team_id: playerInfo.team_id,
          age: playerInfo.age,
          hometown: playerInfo.hometown,
        })
        .eq("player_id", playerInfo.player_id); // match the record to update

      if (error) throw error;

      alert("Player successfully updated!");
      playersList();
      setPlayerInfo(INITIAL_PLAYER_INFO);
      setMode("view");
    } catch (err) {
      console.error("Error updating team:", err.message);
      alert("Failed to update team. Please check the console for details.");
    }
  };

  const handleAddPlayer = async () => {
    if (mode === "view") return;
    if (
      playerInfo.player_id ||
      !playerInfo.first_name ||
      !playerInfo.last_name
    ) {
      return alert("Please fill out required fields");
    }
    try {
      const { error } = await supabase.from("tbl_local_players").insert([
        {
          first_name: playerInfo.first_name,
          middle_name: playerInfo.middle_name,
          last_name: playerInfo.last_name,
          jersey_number: parseInt(playerInfo.jersey_number),
          position: playerInfo.position,
          birthdate: playerInfo.birthdate,
          height_cm: parseInt(playerInfo.height_cm),
          weight_kg: parseInt(playerInfo.weight_kg),
          team_id: parseInt(playerInfo.team_id),
          age: parseInt(playerInfo.age),
          hometown: playerInfo.hometown,
        },
      ]);
      if (error) throw error;
      alert("Player successfully added!");
      playersList();
      setPlayerInfo(INITIAL_PLAYER_INFO);
      setMode("view");
    } catch (err) {
      console.error("Error inserting team:", err.message);
      alert("Failed to add team. Please check the console for details.");
    }
  };

  const debouncedEdit = useDebouncer(handleEditPlayer, 300);
  const debouncedAdd = useDebouncer(handleAddPlayer, 300);

  const handleAddNewPlayer = () => {
    setMode("new");
    setPlayerInfo(INITIAL_PLAYER_INFO);
    setSelectedRow(null);
  };

  const handleViewStats = async () => {
    setSelectedPlayer(playerInfo);

    const stats = await fetchPlayerStats(playerInfo.player_id);
    setPlayerStats(stats);

    setIsModalOpen(true); // open your modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

  return (
    <div className="teamWrapper">
      <form className="teamForm">
        <b
          style={{
            borderBottom: "1px solid black",
            gridColumn: "1 / span 4",
            display: "flex",
            justifyContent: "space-between",
          }}>
          Register Player
          {(playerInfo.player_id || mode === "new") && (
            <button
              className="clearBttn"
              disabled={false}
              type="button"
              onClick={cancelRes}>
              {mode === "view" ? "Clear" : "Cancel"}
            </button>
          )}
        </b>
        <label>First Name</label>
        <input
          disabled={mode === "view"}
          value={playerInfo?.first_name}
          onChange={(e) => {
            handleChangeForm("first_name", e.target.value);
          }}
        />
        <label>Middle Name</label>
        <input
          disabled={mode === "view"}
          value={playerInfo?.middle_name}
          onChange={(e) => {
            handleChangeForm("middle_name", e.target.value);
          }}
        />
        <label>Last Name</label>
        <input
          disabled={mode === "view"}
          value={playerInfo?.last_name}
          onChange={(e) => {
            handleChangeForm("last_name", e.target.value);
          }}
        />
        <label>Jersey No.</label>
        <input
          type="number"
          disabled={mode === "view"}
          value={playerInfo?.jersey_number}
          onChange={(e) => {
            handleChangeForm("jersey_number", e.target.value);
          }}
        />
        <label>Team</label>
        <select
          disabled={mode === "view"}
          value={playerInfo?.team_id ?? ""}
          onChange={(e) => {
            handleChangeForm("team_id", e.target.value);
          }}>
          <option value={""}></option>
          {teams?.map((elem, index) => (
            <option key={elem.team_id + index} value={elem.team_id}>
              {elem.team_name}
            </option>
          ))}
        </select>
        <label>Position</label>
        <select
          disabled={mode === "view"}
          value={playerInfo?.position}
          onChange={(e) => {
            handleChangeForm("position", e.target.value);
          }}>
          <option value=""></option>
          <option value="PG">PG</option>
          <option value="SG">SG</option>
          <option value="SF">SF</option>
          <option value="PF">PF</option>
          <option value="C">C</option>
        </select>
        <label>Birthdate</label>
        <input
          disabled={mode === "view"}
          type="date"
          max={new Date().toISOString().split("T")[0]}
          value={playerInfo?.birthdate}
          onChange={(e) => {
            handleChangeForm("birthdate", e.target.value);
          }}
        />
        <label>Age</label>
        <input
          type="number"
          disabled={mode === "view"}
          value={playerInfo?.age}
          onChange={(e) => {
            handleChangeForm("age", e.target.value);
          }}
        />
        <div
          style={{
            gridColumn: "1/span 2",
            display: "grid",
            gridTemplateColumns: "repeat(4, auto)",
          }}>
          <label>Height cm~</label>
          <input
            style={{ width: "3rem" }}
            type="number"
            disabled={mode === "view"}
            value={playerInfo?.height_cm}
            onChange={(e) => {
              handleChangeForm("height_cm", e.target.value);
            }}
          />
          {/* </div> */}
          {/* <div> */}
          <label>Weight kg~</label>
          <input
            style={{ width: "3rem" }}
            type="number"
            pattern="[0-9]*"
            disabled={mode === "view"}
            value={playerInfo?.weight_kg}
            onChange={(e) => {
              handleChangeForm("weight_kg", e.target.value);
            }}
          />
        </div>
        <label>Hometown</label>
        <select
          disabled={cities.length === 0 || mode === "view"}
          value={playerInfo?.hometown}
          onChange={(e) => handleChangeForm("hometown", e.target.value)}>
          <option value=""></option>
          {cities.map((city) => (
            <option key={city.code} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        {playerInfo.player_id && mode === "view" && (
          <button
            style={{
              gridColumn: "2",
            }}
            id="GeneralBttn"
            type="button"
            onClick={handleViewStats}>
            View Stats
          </button>
        )}
        <div
          style={{
            gridColumn: "3/span 2",
            display: "grid",
            gridTemplateColumns: "auto auto",
          }}>
          <button
            id="GeneralBttn"
            type="button"
            disabled={!playerInfo.player_id}
            // style={{ borderBottom: "1px solid black" }}
            onClick={() => {
              mode === "edit" ? debouncedEdit() : setMode("edit");
            }}>
            {mode === "view" ? "Edit" : "Save edit"}
          </button>
          <button
            disabled={mode === "edit"}
            id="GeneralBttn"
            type="button"
            // style={{ borderBottom: "1px solid black" }}
            onClick={() => {
              mode === "new" ? debouncedAdd() : handleAddNewPlayer();
            }}>
            {mode === "new" ? "Save player" : "New player"}
          </button>
        </div>
      </form>
      {!players.length ? null : (
        <div className="tableWrapper">
          <table className="tableStyle" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Last name</th>
                <th>Age</th>
                <th>Position</th>
                <th>Team</th>
                <th>Birthdate</th>
                <th>Height CM</th>
                <th>Weight Klg</th>
                <th>Age</th>
                <th>Hometown</th>
              </tr>
            </thead>
            <tbody>
              {players.map((elem, index) => (
                <tr
                  key={elem.player_id + index}
                  onClick={() =>
                    mode === "view" ? handlePlayerInfo(elem, index) : null
                  }
                  style={{
                    backgroundColor:
                      selectedRow === index ? "#8fbaff" : "transparent",
                  }}>
                  <td>{elem.first_name}</td>
                  <td>{elem.middle_name}</td>
                  <td>{elem.last_name}</td>
                  <td>{elem.jersey_number}</td>
                  <td>{elem.position}</td>
                  <td>{elem.tbl_local_team.team_name}</td>
                  <td>{elem.birthdate}</td>
                  <td>{elem.height_cm}</td>
                  <td>{elem.weight_kg}</td>
                  <td>{elem.age}</td>
                  <td>{elem.hometown}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && selectedPlayer && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>
            <h2>
              {selectedPlayer.last_name} {selectedPlayer.first_name},{" "}
              {selectedPlayer.middle_name}
            </h2>
            {!playerStats.length && <i>No Data</i>}
            <table>
              <thead>
                <tr>
                  <th>Season</th>
                  <th>Team</th>
                  <th>Points</th>
                  <th>Total minutes played</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map((stat) => (
                  <tr key={stat.season_year + stat.team_name}>
                    <td>{stat.season_year}</td>
                    <td>{stat.team_name}</td>
                    <td>{stat.total_points}</td>
                    <td>{stat.total_minutes}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bolder" }}>
                  <td colSpan="2">Total</td>
                  <td>
                    {playerStats.reduce(
                      (sum, stat) => sum + (stat.total_points || 0),
                      0
                    )}
                  </td>
                  <td>
                    {playerStats.reduce(
                      (sum, stat) => sum + (stat.total_minutes || 0),
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
