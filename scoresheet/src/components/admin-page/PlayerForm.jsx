import { useEffect, useState } from "react";
// import { supabase } from "../../supabaseClient";
import "./AdminStyles.css";
import { fetchCities } from "./fetchFunctions";
// import { useRegions } from "./RegionsAPI";
// import { useDebouncer } from "../../hooks/useDebouncer";

export const PlayerForm = ({ regions, teams }) => {
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
  const [selectedRegionCode, setSelectedRegionCode] = useState("");
  const [playerInfo, setPlayerInfo] = useState(INITIAL_PLAYER_INFO);

  useEffect(() => {
    if (!selectedRegionCode) {
      setCities([]);
      return;
    }
    fetchCities({ selectedRegionCode }).then(setCities).catch(console.error);
  }, [selectedRegionCode]);

  const handleChangeForm = (key, value) => {
    setPlayerInfo((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
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
            disabled={true}
            style={{
              width: "fit-content",
              justifySelf: "end",
              cursor: "pointer",
              gridColumn: "4",
              border: "transparent",
            }}
          >
            Clear
          </button>
        </b>
        <label>First Name</label>
        <input />
        <label>Middle Name</label>
        <input />
        <label>Last Name</label>
        <input />
        <label>Jersey No.</label>
        <input />
        <label>Team</label>
        <select>
          <option value={""}></option>
          {teams.map((elem, index) => (
            <option key={elem.team_id + index} value={elem.team_id}>
              {elem.team_name}
            </option>
          ))}
        </select>
        <label>Role/Position</label>
        <select>
          <option value=""></option>
          <option value="PG">PG</option>
          <option value="SG">SG</option>
          <option value="SF">SF</option>
          <option value="PF">PF</option>
          <option value="C">C</option>
        </select>
        <label>Birthdate</label>
        <input type="date" max={new Date().toISOString().split("T")[0]} />
        <label>Age</label>
        <input />
        <label>Height cm</label>
        <input />
        <label>Weight kg</label>
        <input />
        <label>Region</label>
        <select
          value={regions.find((r) => r.name === playerInfo.region)?.code || ""}
          onChange={(e) => {
            const selectedCode = e.target.value;
            const selectedRegion = regions.find(
              (region) => region.code === selectedCode
            );
            handleChangeForm(
              "region",
              selectedRegion ? selectedRegion.name : ""
            );
            setSelectedRegionCode(selectedCode);
            handleChangeForm("city", "");
          }}
        >
          <option value=""></option>
          {regions.map((region) => (
            <option key={region.code} value={region.code}>
              {region.name}
            </option>
          ))}
        </select>
        <label>Hometown</label>
        <select
          disabled={cities.length === 0 || !playerInfo.region}
          value={playerInfo.city}
          onChange={(e) => handleChangeForm("city", e.target.value)}
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
          >
            Edit
          </button>
          <button
            id="GeneralBttn"
            type="button"
            style={{ borderBottom: "1px solid black" }}
          >
            Add Player
          </button>
        </div>
      </form>
    </div>
  );
};
