import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminPage = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("sessionUser");

    if (!storedUser) {
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    setSession(user);
  }, []);

  return (
    <div className="adminDiv">
      {session && (
        <p>
          Welcome, <strong>{session.user_name}!</strong>
        </p>
      )}
    </div>
  );
};
