import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { MyContextProvider } from './CONTEXT/Context';
import HomeScreen from './SCREENS/HomeScreen';
import FavoriteScreen from './SCREENS/FavoriteScreen';




function App() {
  return (
   
    <MyContextProvider>
 
      <Routes>

        
        <Route path="/" element={<HomeScreen />} />
        <Route path="/favorites" element={<FavoriteScreen />} /> {/* Rutt för favoritsidan */}
     
      </Routes>
   
    </MyContextProvider>
   
  );
}

export default App;
