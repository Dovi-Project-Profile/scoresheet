import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./AdminStyles.css";
import { useDebouncer } from "../../hooks/useDebouncer";
import { useRegions } from "./RegionsAPI";

export const TeamForm = () => {
  const INITIAL_FROM = {
    team_id: null,
    team_name: "",
    short_name: "",
    team_owner: "",
    team_coach: "",
    team_state: "",
    city: "",
    founded_date: "",
  };
  const [form, setForm] = useState(INITIAL_FROM);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRegionCode, setSelectedRegionCode] = useState("");
  const [mode, setMode] = useState("view"); // view, edit, new
  // Load regions
  const { regions } = useRegions();

  // // Load regions
  // useEffect(() => {
  //   fetch(`https://psgc.gitlab.io/api/regions.json`)
  //     .then((res) => {
  //       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  //       return res.json();
  //     })
  //     .then((data) => setRegions(data))
  //     .catch((err) => console.error("Error loading regions:", err));
  // }, []);

  // Load cities when region changes
  useEffect(() => {
    if (!selectedRegionCode) {
      setCities([]);
      handleChangeForm("city", "");
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

  // Fetch all teams
  const fetchTeams = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("tbl_local_team")
        .select("*")
        .order("team_id", { ascending: true });

      if (error) throw error;
      setTeams(data || []);
    } catch (err) {
      console.error("Error fetching teams:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchTeams();
  }, []);

  const capitalizeWords = (text = "") =>
    text.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleChangeForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectTeam = (elem) => {
    setForm(elem);
    const region = regions.find((r) => r.name === elem.team_state);
    setSelectedRegionCode(region ? region.code : "");
  };

  const handleEditTeam = async () => {
    if (mode === "edit") {
      if (!form.team_id) {
        alert("No team selected to edit!");
        return;
      }
      try {
        const { error } = await supabase
          .from("tbl_local_team")
          .update({
            team_name: form.team_name,
            short_name: form.short_name.toUpperCase(),
            team_owner: form.team_owner,
            team_coach: form.team_coach,
            team_state: form.team_state,
            city: form.city,
            founded_date: form.founded_date,
          })
          .eq("team_id", form.team_id); // match the record to update

        if (error) throw error;

        alert("Team successfully updated!");
        await fetchTeams(); // refresh your table after update
        setMode("view");
        setForm(INITIAL_FROM);
      } catch (err) {
        console.error("Error updating team:", err.message);
        alert("Failed to update team. Please check the console for details.");
      }
    }
  };
  const debouncedEdit = useDebouncer(handleEditTeam, 300);

  // Insert into Supabase + auto refresh
  const handleAddTeam = async () => {
    if (mode === "new") {
      if (!form.team_name || !form.team_owner) {
        alert("Please fill out required fields (Team Name & Owner)");
        return;
      }
      try {
        const { error } = await supabase.from("tbl_local_team").insert([
          {
            team_name: form.team_name,
            short_name: form.short_name.toUpperCase(),
            team_owner: form.team_owner,
            team_coach: form.team_coach,
            team_state: form.team_state,
            city: form.city,
            founded_date: form.founded_date,
          },
        ]);

        if (error) throw error;

        alert("Team successfully added!");
        await fetchTeams();
        setMode("view");
        setForm(INITIAL_FROM);
      } catch (err) {
        console.error("Error inserting team:", err.message);
        alert("Failed to add team. Please check the console for details.");
      }
    }
  };
  const debounceNew = useDebouncer(handleAddTeam, 300);

  const handleEnableAddTeam = () => {
    setMode("new");
    setForm(INITIAL_FROM);
  };

  return (
    <div className="teamWrapper">
      {/* Form Section */}
      <form className="teamForm" onSubmit={(e) => e.preventDefault()}>
        <b
          style={{
            borderBottom: "1px solid black",
            gridColumn: "1 / span 4",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Register Team
          {(form.team_id || mode === "new") && (
            <button
              style={{
                width: "fit-content",
                justifySelf: "end",
                cursor: "pointer",
                gridColumn: "4",
                border: "transparent",
              }}
              onClick={() => {
                setForm(INITIAL_FROM);
                setMode("view");
              }}
            >
              {mode === "view" ? "Clear" : "Cancel"}
            </button>
          )}
        </b>
        <label>Team Name</label>
        <input
          disabled={mode === "view"}
          value={form.team_name}
          onChange={(e) =>
            handleChangeForm("team_name", capitalizeWords(e.target.value))
          }
        />
        <label>Short Name</label>
        <input
          disabled={mode === "view"}
          value={form.short_name}
          onChange={(e) =>
            handleChangeForm("short_name", capitalizeWords(e.target.value))
          }
        />
        <label>Owner</label>
        <input
          disabled={mode === "view"}
          value={form.team_owner}
          onChange={(e) =>
            handleChangeForm("team_owner", capitalizeWords(e.target.value))
          }
        />
        <label>Coach</label>
        <input
          disabled={mode === "view"}
          value={form.team_coach}
          onChange={(e) =>
            handleChangeForm("team_coach", capitalizeWords(e.target.value))
          }
        />
        <label>Region</label>
        <select
          disabled={mode === "view"}
          value={regions.find((r) => r.name === form.team_state)?.code || ""}
          onChange={(e) => {
            const selectedCode = e.target.value;
            const selectedRegion = regions.find(
              (region) => region.code === selectedCode
            );
            handleChangeForm(
              "team_state",
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

        <label>City / Municipalities</label>
        <select
          disabled={cities.length === 0 || !form.team_state || mode === "view"}
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
        <label>Founded Date</label>
        <input
          disabled={mode === "view"}
          type="date"
          value={form.founded_date}
          onChange={(e) => handleChangeForm("founded_date", e.target.value)}
        />
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
            onClick={() =>
              mode === "edit" ? debouncedEdit() : setMode("edit")
            }
            style={{ borderBottom: "1px solid black" }}
            disabled={form.team_id === null}
          >
            {mode === "edit" ? "Save edit" : "Edit"}
          </button>
          <button
            disabled={mode === "edit"}
            id="GeneralBttn"
            type="button"
            onClick={() =>
              mode === "new" ? debounceNew() : handleEnableAddTeam()
            }
            style={{ borderBottom: "1px solid black" }}
            // disabled={form.team_id !== null}
          >
            {mode === "new" ? "Save team" : "New team"}
          </button>
        </div>
      </form>
      {/* Table Section */}
      {loading ? (
        <p>Loading team data...</p>
      ) : (
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #ccc",
            width: "fit-content",
          }}
        >
          <table
            className="tableStyle"
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse" }}
          >
            <thead
              style={{
                backgroundColor: "#f0f0f0",
                position: "sticky",
                top: 0,
                zIndex: 2,
              }}
            >
              <tr>
                <th>Team Name</th>
                <th>Short Name</th>
                <th>Owner</th>
                <th>Coach</th>
                <th>Region</th>
                <th>City</th>
                <th>Founded</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((elem, index) => (
                <tr
                  style={{ cursor: "pointer" }}
                  key={elem.team_id + index}
                  onClick={() =>
                    mode === "view" ? handleSelectTeam(elem) : null
                  }
                >
                  <td>{elem.team_name}</td>
                  <td>{elem.short_name}</td>
                  <td>{elem.team_owner}</td>
                  <td>{elem.team_coach}</td>
                  <td>{elem.team_state}</td>
                  <td>{elem.city}</td>
                  <td>{elem.founded_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
