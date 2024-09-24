import { Routes, Route } from "react-router-dom";

import { MyContextProvider } from "./constants/Context";
import HomeScreen from "./SCREENS/HomeScreen";
import FavoriteScreen from "./SCREENS/FavoriteScreen";
import AllMoviesScreen from "./SCREENS/AllMoviesScreen";
import RegisterScreen from "./SCREENS/RegisterScreen";

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
