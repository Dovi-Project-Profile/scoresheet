import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export const Login = () => {
  const navigate = useNavigate();
  const [credential, setCredential] = useState({ userName: "", password: "" });

  const handleCredential = (key, value) => {
    setCredential((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoginNav = async () => {
    const { userName, password } = credential;

    if (!userName || !password) {
      alert("Please enter both username and password.");
      return;
    }

    const { data, error } = await supabase
      .from("tbl_user_access")
      .select("*")
      .eq("user_name", userName)
      .eq("user_password", password)
      .single();

    if (error || !data) {
      alert("Login Failed: Credentials Incorrect.");
      console.error("Login error:", error);
      return;
    }

    localStorage.setItem("sessionUser", JSON.stringify(data));
    window.dispatchEvent(new Event("authChanged"));
    navigate("/adminIndex");
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
        e.preventDefault(); // prevent page reload
        handleLoginNav();
      }}
    >
      <b>Login</b>
      <input
        placeholder="username"
        onChange={(e) => handleCredential("userName", e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => handleCredential("password", e.target.value)}
      />
      <button id="GeneralBttn" type="submit">
        Login
      </button>
    </form>
  );
};
