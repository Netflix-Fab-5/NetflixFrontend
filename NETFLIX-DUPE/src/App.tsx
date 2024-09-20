import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Filters from "./Components/Filters"
import FlexMovieItems from "./Components/FlexMovieItems"
import Head from "./Components/Head"
import Movie from "./Components/Movie"
import Starts from "./Components/Starts"
import Table from "./Components/Table"
import Table2 from "./Components/Table2"
import Titles from "./Components/Titles"
import Uploader from "./Components/Uploader"
import UsedInputs from "./Components/UsedInputs"
import { MyContextProvider } from './Context/Context';



function App() {
  return (
   
    <MyContextProvider>
 
      <Routes>

        
        <Route path="/Filters" element={<Filters />} />
        <Route path="/FlexMovieItems" element={<FlexMovieItems />} />
        <Route path="/Head" element={<Head />} />
        <Route path="/Movie" element={<Movie />} />
        <Route path="/Starts" element={<Starts />} />
        <Route path="/Table" element={<Table />} />
        <Route path="/Table2" element={<Table2 />} />
        <Route path="/Titles" element={<Titles />} />
        <Route path="/Uploader" element={<Uploader />} />
        <Route path="/UsedInputs" element={<UsedInputs />} />
      </Routes>
   
    </MyContextProvider>
   
  );
}

export default App;
