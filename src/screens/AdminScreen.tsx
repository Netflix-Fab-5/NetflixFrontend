
import NavBar from "../components/navbar/NavBar";
import {  useContext } from "react";
import { MyContext } from "../constants/context";


function HomeScreen() {
  const {  loading, error } = useContext(MyContext);
 

  

  if (loading) {
    return <p>Loading movies...</p>;
  }

  if (error) {
    return <p>Error loading movies: {error}</p>;
  }

  return (
    <div>
      <NavBar />
      {/* inside header we should have login/register/bookmark/searchbar/movies link to category */}
    
     ADMIN4LIFE
    </div>
  );
}

export default HomeScreen;
