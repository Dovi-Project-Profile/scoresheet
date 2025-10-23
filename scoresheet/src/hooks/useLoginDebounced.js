import { useState, useRef, useCallback } from "react";
import { supabase } from "../supabaseClient";

export function useLoginDebounced(debounceDelay = 700) {
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const timeoutRef = useRef(null);

  const login = useCallback(
    async (credentials, onSuccess, onError) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(async () => {
        setLoading(true);
        try {
          const { userName, password } = credentials;
          if (!userName || !password) {
            return setLoginMessage("Please enter both username and password.");
          }
          const { data, error } = await supabase
            .from("tbl_user_access")
            .select("*")
            .eq("user_name", userName)
            .eq("user_password", password)
            .single();
          if (error || !data) {
            return setLoginMessage("Login Failed: Credentials Incorrect.");
          }
          // Store session and notify app
          localStorage.setItem("sessionUser", JSON.stringify(data));
          window.dispatchEvent(new Event("authChanged"));
          onSuccess?.(data);
        } catch (err) {
          console.error("Login error:", err.message);
          onError?.(err.message);
        } finally {
          setLoading(false);
        }
      }, debounceDelay);
    },
    [debounceDelay]
  );

  return { login, loading, loginMessage };
}
