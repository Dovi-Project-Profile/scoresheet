// import { useNavigate, useLocation } from "react-router-dom";
import { AdminPage } from "../components/admin-page/AdminPage";
import { TeamForm } from "../components/admin-page/TeamForm";
import { PlayerForm } from "../components/admin-page/PlayerForm";
import { useRegions } from "../components/admin-page/RegionsAPI";
// import { AutoLogout } from "../components/AutoLogout";

const AdminIndex = () => {
  //   const navigate = useNavigate();
  //   const location = useLocation();

  //   const handleLogout = () => {
  //     localStorage.removeItem("sessionUser");
  //     navigate("/login");
  //   };

  //   const shouldAutoLogout = location.pathname === "/adminIndex";

  //   console.log(location.pathname);
  const { regions } = useRegions();
  return (
    <div style={{ boxSizing: "border-box" }}>
      {/* {shouldAutoLogout && <AutoLogout handleLogout={handleLogout} />} */}
      <AdminPage />
      <TeamForm regions={regions} />
      <PlayerForm regions={regions} />
    </div>
  );
};

export default AdminIndex;
