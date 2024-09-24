import { Routes, Route } from "react-router-dom";

import { MyContextProvider } from "./constants/Context";
import HomeScreen from "./screens/HomeScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import AllMoviesScreen from "./screens/AllMoviesScreen";
import RegisterScreen from "./screens/RegisterScreen";

function App() {
  return (
    <MyContextProvider>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/favorites" element={<FavoriteScreen />} />{" "}
        {/* Rutt för favoritsidan */}
        <Route path="/movies" element={<AllMoviesScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
      </Routes>
    </MyContextProvider>
  );
}

export default App;
