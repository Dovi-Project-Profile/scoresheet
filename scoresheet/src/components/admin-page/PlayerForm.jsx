import { useEffect, useState } from "react";
// import { supabase } from "../../supabaseClient";
import "./AdminStyles.css";
import { fetchCitiesMunicipalities, fetchPlayers } from "./fetchFunctions";
import { supabase } from "../../supabaseClient";
// import { useRegions } from "./RegionsAPI";
// import { useDebouncer } from "../../hooks/useDebouncer";

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

  const handleChangeForm = (key, value) => {
    setPlayerInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleplayerInfo = (elem, index) => {
    setSelectedRow(index);
    setPlayerInfo(elem);
    console.log(elem);
  };

  const handleEditPlayer = async () => {
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
    } catch (err) {
      console.error("Error updating team:", err.message);
      alert("Failed to update team. Please check the console for details.");
    }
  };

  const handleAddPlayer = async () => {
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
    } catch (err) {
      console.error("Error inserting team:", err.message);
      alert("Failed to add team. Please check the console for details.");
    }
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
          }}
        >
          Register Player
          <button
            className="clearBttn"
            disabled={false}
            type="button"
            onClick={(e) => {
              e.preventDefault;
              setPlayerInfo(INITIAL_PLAYER_INFO);
              setSelectedRow(null);
            }}
          >
            Clear
          </button>
        </b>
        <label>First Name</label>
        <input
          value={playerInfo?.first_name}
          onChange={(e) => {
            handleChangeForm("first_name", e.target.value);
          }}
        />
        <label>Middle Name</label>
        <input
          value={playerInfo?.middle_name}
          onChange={(e) => {
            handleChangeForm("middle_name", e.target.value);
          }}
        />
        <label>Last Name</label>
        <input
          value={playerInfo?.last_name}
          onChange={(e) => {
            handleChangeForm("last_name", e.target.value);
          }}
        />
        <label>Jersey No.</label>
        <input
          value={playerInfo?.jersey_number}
          onChange={(e) => {
            handleChangeForm("jersey_number", e.target.value);
          }}
        />
        <label>Team</label>
        <select
          value={playerInfo?.team_id ?? ""}
          onChange={(e) => {
            handleChangeForm("team_id", e.target.value);
          }}
        >
          <option value={""}></option>
          {teams?.map((elem, index) => (
            <option key={elem.team_id + index} value={elem.team_id}>
              {elem.team_name}
            </option>
          ))}
        </select>
        <label>Position</label>
        <select
          value={playerInfo?.position}
          onChange={(e) => {
            handleChangeForm("position", e.target.value);
          }}
        >
          <option value=""></option>
          <option value="PG">PG</option>
          <option value="SG">SG</option>
          <option value="SF">SF</option>
          <option value="PF">PF</option>
          <option value="C">C</option>
        </select>
        <label>Birthdate</label>
        <input
          type="date"
          max={new Date().toISOString().split("T")[0]}
          value={playerInfo?.birthdate}
          onChange={(e) => {
            handleChangeForm("birthdate", e.target.value);
          }}
        />
        <label>Age</label>
        <input
          value={playerInfo?.age}
          onChange={(e) => {
            handleChangeForm("age", e.target.value);
          }}
        />
        <label>Height cm</label>
        <input
          value={playerInfo?.height_cm}
          onChange={(e) => {
            handleChangeForm("height_cm", e.target.value);
          }}
        />
        <label>Weight kg</label>
        <input
          value={playerInfo?.weight_kg}
          onChange={(e) => {
            handleChangeForm("weight_kg", e.target.value);
          }}
        />
        <label>Hometown</label>
        <select
          disabled={cities.length === 0}
          value={playerInfo?.hometown}
          onChange={(e) => handleChangeForm("hometown", e.target.value)}
        >
          <option value=""></option>
          {cities.map((city) => (
            <option key={city.code} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
        <div
          style={{
            gridColumn: "3/span 2",
            display: "grid",
            gridTemplateColumns: "auto auto",
          }}
        >
          <button
            id="GeneralBttn"
            type="button"
            style={{ borderBottom: "1px solid black" }}
            onClick={() => {
              handleEditPlayer();
            }}
          >
            Edit
          </button>
          <button
            id="GeneralBttn"
            type="button"
            style={{ borderBottom: "1px solid black" }}
            onClick={() => {
              handleAddPlayer();
            }}
          >
            Add Player
          </button>
        </div>
      </form>
      {players.length && (
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
                  onClick={() => handleplayerInfo(elem, index)}
                  style={{
                    backgroundColor:
                      selectedRow === index ? "#8fbaff" : "transparent",
                  }}
                >
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
    </div>
  );
};
