import React from 'react';
import Trending from '../Components/HOME/Trending';
import Recommended from '../Components/HOME/Recommended';
import NavBar from '../Components/NAVBAR/NavBar';




function HomeScreen() {
  return (
  
      <div>
       
        <NavBar/>
       {/* inside header we should have login/register/bookmark/searchbar/movies link to category */}
    

        <Trending />
       
        <Recommended />
        HOMESCREEN
      </div>
     
  
  );
}

export default HomeScreen;
