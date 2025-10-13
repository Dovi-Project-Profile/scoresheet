import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

export const TeamForm = () => {
  const [form, setForm] = useState({
    team_name: "",
    short_name: "",
    team_owner: "",
    team_coach: "",
    team_state: "",
    city: "",
    founded_date: "",
  });
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRegionCode, setSelectedRegionCode] = useState("");

  // Load regions
  useEffect(() => {
    fetch("https://psgc.gitlab.io/api/regions/")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => setRegions(data))
      .catch((err) => console.error("Error loading regions:", err));
  }, []);

  // Load cities when region changes
  useEffect(() => {
    if (!selectedRegionCode) {
      setCities([]);
      handleChange("city", "");
      return;
    }

    fetch("https://psgc.gitlab.io/api/cities/")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const filtered = data.filter(
          (city) => city.regionCode === selectedRegionCode
        );
        setCities(filtered);
        handleChange("city", "");
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

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Insert into Supabase + auto refresh
  const handleAddTeam = async () => {
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

      // Refresh table from database
      await fetchTeams();

      // Reset form
      setForm({
        team_name: "",
        short_name: "",
        team_owner: "",
        team_coach: "",
        team_state: "",
        city: "",
        founded_date: "",
      });
    } catch (err) {
      console.error("Error inserting team:", err.message);
      alert("Failed to add team. Please check the console for details.");
    }
  };

  return (
    <div>
      {/* Form Section */}
      <form
        onSubmit={(e) => e.preventDefault()}
        style={{
          display: "grid",
          alignItems: "flex-start",
          justifyContent: "start",
          gridTemplateColumns: "auto auto auto auto",
          gap: "10px",
          padding: "20px",
          backgroundColor: "#f0f0f0",
          borderRadius: "10px",
          width: "fit-content",
          marginBottom: "20px",
        }}
      >
        <b
          style={{ borderBottom: "1px solid black", gridColumn: "1 / span 4" }}
        >
          Register Team
        </b>
        <label>Team Name</label>
        <input
          value={form.team_name}
          onChange={(e) => handleChange("team_name", e.target.value)}
        />
        <label>Short Name</label>
        <input
          value={form.short_name}
          onChange={(e) => handleChange("short_name", e.target.value)}
        />
        <label>Owner</label>
        <input
          value={form.team_owner}
          onChange={(e) => handleChange("team_owner", e.target.value)}
        />
        <label>Coach</label>
        <input
          value={form.team_coach}
          onChange={(e) => handleChange("team_coach", e.target.value)}
        />
        <label>Region</label>
        <select
          value={regions.find((r) => r.name === form.team_state)?.code || ""}
          onChange={(e) => {
            const selectedCode = e.target.value;
            const selectedRegion = regions.find(
              (region) => region.code === selectedCode
            );
            handleChange(
              "team_state",
              selectedRegion ? selectedRegion.name : ""
            );
            setSelectedRegionCode(selectedCode);
          }}
        >
          <option value=""></option>
          {regions.map((region) => (
            <option key={region.code} value={region.code}>
              {region.name}
            </option>
          ))}
        </select>

        <label>City</label>
        <select
          value={form.city}
          onChange={(e) => handleChange("city", e.target.value)}
          disabled={cities.length === 0 || !form.team_state}
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
          type="date"
          value={form.founded_date}
          onChange={(e) => handleChange("founded_date", e.target.value)}
        />
        <button
          id="GeneralBttn"
          type="button"
          onClick={handleAddTeam}
          style={{ borderBottom: "1px solid black", gridColumn: "4" }}
        >
          Add Team
        </button>
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
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse" }}
          >
            <thead
              style={{
                backgroundColor: "#f0f0f0",
                position: "sticky",
                top: 0,
                zIndex: 2, // keeps header above rows
              }}
            >
              <tr>
                <th>ID</th>
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
                <tr key={elem.team_id + index}>
                  <td>{elem.team_id}</td>
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
