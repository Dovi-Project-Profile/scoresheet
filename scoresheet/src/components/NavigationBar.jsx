import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AutoLogout } from "./AutoLogout";

export const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // check current stored session
    const storedUser = localStorage.getItem("sessionUser");
    setIsLoggedIn(!!storedUser);

    // listen for custom event (login/logout) from other components
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem("sessionUser");
      setIsLoggedIn(!!updatedUser);
    };

    window.addEventListener("authChanged", handleAuthChange);
    let res = JSON.parse(storedUser);
    setUser(res?.user_name);

    // cleanup listener on unmount
    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, [isLoggedIn]);

  const shouldAutoLogout = location.pathname === "/adminIndex";

  const handleLogout = () => {
    localStorage.removeItem("sessionUser");
    localStorage.removeItem("teamsList");
    setIsLoggedIn(false);

    // notify others that session changed
    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  return (
    <nav>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}>
        <h1>Welcome Basketballero</h1>
        {isLoggedIn && (
          <p>
            Welcome, <strong>{user}!</strong>
          </p>
        )}
      </div>
      {shouldAutoLogout && <AutoLogout handleLogout={handleLogout} />}
      <Link to="/">Home</Link>
      {isLoggedIn ? (
        <>
          <Link to="/login" onClick={handleLogout}>
            Logout
          </Link>
          <Link to="/adminIndex">Admin Panel</Link>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
      <Link to="/scoreboard">Scoreboard</Link>
    </nav>
  );
};
