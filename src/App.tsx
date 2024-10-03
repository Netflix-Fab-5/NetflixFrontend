import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import HomeScreen from "./screens/Home/HomeScreen";
import FavoriteScreen from "./screens/Favorites/FavoriteScreen";
import AllMoviesScreen from "./screens/Movies/AllMoviesScreen";
import MovieDetailScreen from "./screens/Movies/MovieDetailScreen";
import LoginScreen from "./screens/Auth/LoginScreen";
import ProtectedLayout from "./components/common/ProtectedLayout";
import AddAMovie from "./components/admin/AddAMovie";
import EditAMovie from "./components/admin/EditAMovie";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {user ? (
        user.email === "admin@mail.com" ? (
          // Rendera admin-specifika rutter
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/favorites" element={<FavoriteScreen />} />
            <Route path="/movies" element={<AllMoviesScreen />} />
            <Route path="/movies/add-new-movie" element={<AddAMovie />} />

            <Route path="/movies/:title" element={<MovieDetailScreen />} />
            <Route path="/movies/edit/:movieId" element={<EditAMovie />} />
            <Route path="/new" element={<AddAMovie />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        ) : (
          // Rendera vanliga användarrutter
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/favorites" element={<FavoriteScreen />} />
            <Route path="/movies" element={<AllMoviesScreen />} />
            <Route path="/movies/:title" element={<MovieDetailScreen />} />
            <Route path="/new" element={<AddAMovie />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        )
      ) : (
        // För icke-inloggade användare, rendera bara login-rutter
        <>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
