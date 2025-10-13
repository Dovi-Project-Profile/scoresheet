import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  // check for your local session
  const storedUser = localStorage.getItem("sessionUser");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // if not logged in, redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // otherwise, render the protected page
  return children;
};
