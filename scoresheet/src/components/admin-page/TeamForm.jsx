import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./AdminStyles.css";
import { useDebouncer } from "../../hooks/useDebouncer";
import { fetchCities, fetchPlayersByTeam } from "./fetchFunctions";
import PropTypes from "prop-types";
import { TeamList } from "./TeamList";

export const TeamForm = ({ regions, teams, isTeamsLoading, refreshTeams }) => {
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
  const [selectedRow, setSelectedRow] = useState(null);
  const [form, setForm] = useState(INITIAL_FROM);
  const [cities, setCities] = useState([]);
  const [selectedRegionCode, setSelectedRegionCode] = useState("");
  const [mode, setMode] = useState("view"); // view, edit, new
  const [teamMemberList, setTeamMemberList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Load regions

  // Load cities when region changes
  useEffect(() => {
    if (!selectedRegionCode) {
      setCities([]);
      handleChangeForm("city", "");
      return;
    }
    fetchCities({ selectedRegionCode }).then(setCities).catch(console.error);
  }, [selectedRegionCode]);

  const capitalizeWords = (text = "") =>
    text.replaceAll(/\b\w/g, (char) => char.toUpperCase());

  const cancelRes = () => {
    const reset = () => {
      setForm(INITIAL_FROM);
      setMode("view");
      setSelectedRow(null);
    };

    if (mode === "view") {
      reset();
    } else if (confirm("Are you sure you want to proceed?")) reset();
  };

  const handleChangeForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectTeam = (elem, index) => {
    setSelectedRow(index);
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
        // fetchData(); // refresh your table after update
        await refreshTeams();
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
        await refreshTeams();
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
    setSelectedRow(null);
  };

  const fetchTeamMemberList = async () => {
    const players = await fetchPlayersByTeam(form.team_id);
    setTeamMemberList(players);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
              className="clearBttn"
              onClick={() => {
                cancelRes();
              }}
            >
              {mode === "view" ? "Clear" : "Cancel"}
            </button>
          )}
        </b>
        <text>Team Name</text>
        <input
          disabled={mode === "view"}
          value={form.team_name}
          onChange={(e) =>
            handleChangeForm("team_name", capitalizeWords(e.target.value))
          }
        />
        <text>Short Name</text>
        <input
          disabled={mode === "view"}
          value={form.short_name}
          onChange={(e) =>
            handleChangeForm("short_name", capitalizeWords(e.target.value))
          }
        />
        <text>Owner</text>
        <input
          disabled={mode === "view"}
          value={form.team_owner}
          onChange={(e) =>
            handleChangeForm("team_owner", capitalizeWords(e.target.value))
          }
        />
        <text>Coach</text>
        <input
          disabled={mode === "view"}
          value={form.team_coach}
          onChange={(e) =>
            handleChangeForm("team_coach", capitalizeWords(e.target.value))
          }
        />
        <text>Region</text>
        <select
          className="maxWith"
          disabled={mode === "view"}
          value={regions.find((r) => r.name === form.team_state)?.code || ""}
          onChange={(e) => {
            const selectedCode = e.target.value;
            const selectedRegion = regions.find(
              (region) => region.code === selectedCode,
            );
            handleChangeForm(
              "team_state",
              selectedRegion ? selectedRegion.name : "",
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

        <text>City-Municipalities</text>
        <select
          className="maxWith"
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
        <text>Founded Date</text>
        <input
          disabled={mode === "view"}
          type="date"
          max={new Date().toISOString().split("T")[0]}
          value={form.founded_date}
          onChange={(e) => handleChangeForm("founded_date", e.target.value)}
        />
        {form.team_id && mode === "view" && (
          <button
            style={{
              borderBottom: "1px solid black",
              gridColumn: "2 / span 1",
              gridRow: "6",
            }}
            disabled={mode === "edit"}
            id="GeneralBttn"
            type="button"
            onClick={() => {
              fetchTeamMemberList();
              setTimeout(() => {
                setIsModalOpen(true);
              }, 500);
            }}
            // disabled={form.team_id !== null}
          >
            Show players
          </button>
        )}
        <div
          style={{
            gridColumn: "3 / span 2",
            gridRow: "6",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
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
      {isTeamsLoading ? (
        <p>Loading team data...</p>
      ) : (
        <div className="tableWrapper">
          <table className="tableStyle" border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Short Name</th>
                <th>Owner</th>
                <th>Coach</th>
                <th>Region</th>
                <th>City-Municipalities</th>
                <th>Founded</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((elem, index) => (
                <tr
                  key={elem.team_id + index}
                  onClick={() =>
                    mode === "view" ? handleSelectTeam(elem, index) : null
                  }
                  style={{
                    backgroundColor: selectedRow === index ? "#8fbaff" : "",
                  }}
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
      {isModalOpen && teamMemberList && <TeamList closeModal={closeModal} playersList={teamMemberList} />}
    </div>
  );
};

TeamForm.propTypes = {
  regions: PropTypes.any,
  teams: PropTypes.string.isRequired,
  isTeamsLoading: PropTypes.any,
  refreshTeams: PropTypes.func.isRequired,
};
