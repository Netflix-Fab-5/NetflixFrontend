import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { MyContextProvider } from './Context/Context';
import HomeScreen from './screens/HOME/HomeScreen';




function App() {
  return (
   
    <MyContextProvider>
 
      <Routes>

        
        <Route path="/" element={<HomeScreen />} />
     
      </Routes>
   
    </MyContextProvider>
   
  );
}

export default App;
