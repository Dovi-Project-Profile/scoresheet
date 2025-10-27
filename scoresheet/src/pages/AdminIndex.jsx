// import { useNavigate, useLocation } from "react-router-dom";
import { AdminPage } from "../components/admin-page/AdminPage";
import { TeamForm } from "../components/admin-page/TeamForm";
import { PlayerForm } from "../components/admin-page/PlayerForm";
import {
  fetchTeams,
  useRegions,
} from "../components/admin-page/fetchFunctions";
import { useCallback, useEffect, useState } from "react";

const AdminIndex = () => {
  const { regions } = useRegions();
  const [teams, setTeams] = useState([]);
  const [isTeamsLoading, setIsTeamsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsTeamsLoading(true);
      const data = await fetchTeams(); // this calls your API
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
      <AdminPage />
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
