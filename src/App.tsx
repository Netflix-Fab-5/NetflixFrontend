import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import HomeScreen from "./screens/HomeScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import AllMoviesScreen from "./screens/AllMoviesScreen";
import MovieDetailScreen from "./screens/MovieDetailScreen";
import LoginScreen from "./screens/LoginScreen";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Laddar...</div>;
  }
  return (
    <Routes>
      {/* Skyddade rutter */}
      {user ? (
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/favorites" element={<FavoriteScreen />} />
          <Route path="/movies" element={<AllMoviesScreen />} />
          <Route path="/movies/:id" element={<MovieDetailScreen />} />
        </Route>
      ) : (
        <>
          {/* oskyddade rutter */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
