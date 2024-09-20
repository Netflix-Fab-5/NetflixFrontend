import React from 'react';
import Trending from './Trending';
import Recommended from './Recommended';
import NavBar from '../../Layout/NavBar';




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
