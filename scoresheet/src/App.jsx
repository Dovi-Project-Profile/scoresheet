import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Scoreboard } from "./pages/Scoreboard";
import { Login } from "./pages/login";
import AdminIndex from "./pages/AdminIndex";
import { ProtectedRoute } from "./components/ProtectedRoute";
import "./App.css";
import { NavigationBar } from "./components/NavigationBar";
import { TeamsProvider } from "./hooks/Context";

function App() {
  return (
    <TeamsProvider>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route
            path="/adminIndex"
            element={
              <ProtectedRoute>
                <AdminIndex />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TeamsProvider>
  );
}

export default App;
