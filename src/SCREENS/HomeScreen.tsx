import React from 'react';
import Trending from '../components/HOME/Trending';
import Recommended from '../components/HOME/Recommended';
import NavBar from '../components/NAVBAR/NavBar';




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
