import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./AdminStyles.css";
import { useRegions } from "./RegionsAPI";
// import { useDebouncer } from "../../hooks/useDebouncer";

export const PlayerForm = () => {
  const INITIAL_FROM = {
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
  const [form, setForm] = useState(INITIAL_FROM);
  // Load regions
  const { regions } = useRegions();

  // Load cities when region changes
  useEffect(() => {
    if (!selectedRegionCode) {
      setCities([]);
      // handleChangeForm("city", "");
      return;
    }

    fetch(
      `https://psgc.gitlab.io/api/regions/${selectedRegionCode}/cities-municipalities.json`
    )
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCities(data);
        // handleChangeForm("city", "");
      })
      .catch((err) => console.error("Error loading cities:", err));
  }, [selectedRegionCode]);

  const handleChangeForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
          <option value=""></option>
        </select>
        <label>Role/Position</label>
        <select>
          <option value=""></option>
          <option>PG</option>
          <option>SG</option>
          <option>SF</option>
          <option>PF</option>
          <option>C</option>
        </select>
        <label>Birthdate</label>
        <input type="date" />
        <label>Age</label>
        <input />
        <label>Height</label>
        <input />
        <label>Weight</label>
        <input />
        <label>Region</label>
        <select
          value={regions.find((r) => r.name === form.region)?.code || ""}
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
          disabled={cities.length === 0 || !form.region}
          value={form.city}
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
