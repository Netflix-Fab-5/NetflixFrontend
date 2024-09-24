import { Routes, Route } from "react-router-dom";

import { MyContextProvider } from "./constants_temp/context_temp";
import HomeScreen from "./screens_temp/HomeScreen_temp";
import FavoriteScreen from "./screens_temp/FavoriteScreen_temp";
import AllMoviesScreen from "./screens_temp/AllMoviesScreen_temp";
import RegisterScreen from "./screens_temp/RegisterScreen_temp";

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
