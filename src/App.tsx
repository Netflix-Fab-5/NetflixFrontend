import { Routes, Route } from "react-router-dom";

import { MyContextProvider } from './CONTEXT/Context';
import HomeScreen from './SCREENS/HomeScreen';
import FavoriteScreen from './SCREENS/FavoriteScreen';
import AllMoviesScreen from './SCREENS/AllMoviesScreen';




function App() {
  return (
    <MyContextProvider>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/favorites" element={<FavoriteScreen />} /> {/* Rutt för favoritsidan */}
        <Route path="/movies" element={<AllMoviesScreen />} />
      </Routes>
    </MyContextProvider>
  );
}

export default App;
