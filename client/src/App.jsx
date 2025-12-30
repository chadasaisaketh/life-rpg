import { useAuth } from "./context/AuthContext";
import AuthPage from "./auth/AuthPage";

export default function App() {
  const { user } = useAuth();
  console.log("USER:", user);

  return <AuthPage />;
}
