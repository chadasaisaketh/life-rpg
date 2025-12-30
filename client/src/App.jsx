import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./auth/AuthPage";
import AppLayout from "./layout/AppLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Learnings from "./pages/Learnings";
import Body from "./pages/Body";
import Nutrition from "./pages/Nutrition";
import Spiritual from "./pages/Spiritual";
import Monsters from "./pages/Monsters";
import Achievements from "./pages/Achievements";
import Profile from "./pages/Profile";

export default function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <AuthPage />}
        />

        {/* PROTECTED LAYOUT */}
        <Route
          element={user ? <AppLayout /> : <Navigate to="/" />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/learnings" element={<Learnings />} />
          <Route path="/body" element={<Body />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/spiritual" element={<Spiritual />} />
          <Route path="/monsters" element={<Monsters />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}
