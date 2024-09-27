import { Routes, Route, Navigate } from "react-router-dom";

import HomeScreen from "./screens/HomeScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import AllMoviesScreen from "./screens/AllMoviesScreen";
import MovieDetailScreen from "./screens/MovieDetailScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
  return (
    <Routes>
      {/* oskyddade rutter */}
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/login" element={<LoginScreen />} />

      {/* Skyddade rutter */}
      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/favorites" element={<FavoriteScreen />} />
        <Route path="/movies" element={<AllMoviesScreen />} />
        <Route path="/movies/:id" element={<MovieDetailScreen />} />
      </Route>

      {/* Om ruttinte hittas, omdirigera till /login om ej inloggad, annars till home */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
