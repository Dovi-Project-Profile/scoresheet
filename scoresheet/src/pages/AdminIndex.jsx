// import { useNavigate, useLocation } from "react-router-dom";
import { TeamForm } from "../components/admin-page/TeamForm";
import { PlayerForm } from "../components/admin-page/PlayerForm";
import {
  fetchTeams,
  useRegions,
} from "../components/admin-page/fetchFunctions";
import { useCallback, useEffect, useState } from "react";
import { useTeams } from "../hooks/Context";

const AdminIndex = () => {
  const { teams, setTeams } = useTeams();
  const { regions } = useRegions();
  const [isTeamsLoading, setIsTeamsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsTeamsLoading(true);
      const data = await fetchTeams(); // this calls your API
      localStorage.setItem("teamsList", JSON.stringify(data));
      setTeams(data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setIsTeamsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ boxSizing: "border-box" }}>
      <TeamForm
        regions={regions}
        teams={teams}
        isTeamsLoading={isTeamsLoading}
        refreshTeams={fetchData}
      />
      <PlayerForm teams={teams} />
    </div>
  );
};

export default AdminIndex;
