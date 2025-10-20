import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginDebounced } from "../hooks/useLoginDebounced";
import "../components/buttonStyles.css"

export const Login = () => {
  const navigate = useNavigate();
  const [credential, setCredential] = useState({ userName: "", password: "" });
  const { login, loading } = useLoginDebounced(300); // 700ms debounce

  const handleCredential = (key, value) => {
    setCredential((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoginNav = () => {
    login(
      credential,
      () => navigate("/adminIndex"),
      (errMsg) => alert(errMsg)
    );
  };

  return (
    <form
      style={{
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleLoginNav();
      }}
    >
      <b>Login</b>
      <input
        placeholder="Username"
        onChange={(e) => handleCredential("userName", e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => handleCredential("password", e.target.value)}
      />
      <button id="LoginBttn" type="submit" disabled={loading}>
        {loading ? <span className="loader"></span> : "Login"}
      </button>
    </form>
  );
};
