import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Använder useAuth-hooken för att hämta autentiseringsstatus

function ProtectedLayout() {
  const { user, loading } = useAuth(); // Hämtar användaren och laddningsstatus från useAuth

  // Medan autentiseringsstatus laddas
  if (loading) {
    return <div>Laddar...</div>;
  }

  // Om ingen användare är inloggad, omdirigera till inloggningssidan
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Om användaren är inloggad, rendera de skyddade komponenterna
  return <Outlet />;
}

export default ProtectedLayout;
