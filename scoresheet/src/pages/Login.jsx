import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginDebounced } from "../hooks/useLoginDebounced";
import "../components/buttonStyles.css";

export const Login = () => {
  const navigate = useNavigate();
  const [credential, setCredential] = useState({ userName: "", password: "" });
  const { login, loading, loginMessage } = useLoginDebounced(300); // 700ms debounce

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
    <div style={{boxSizing:"border-box",display:"flex", width: "100%",justifyContent:"center"}}>
      <form
        className="formStyle"
        onSubmit={(e) => {
          e.preventDefault();
          handleLoginNav();
        }}
      >
        <b>Login</b>
        {loginMessage && <text className="loginMessage">{loginMessage}</text>}
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
    </div>
  );
};
