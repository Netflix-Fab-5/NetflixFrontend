import Trending from "../components_temp/Home_temp/Trending_temp";
import Recommended from "../components_temp/Home_temp/Recommended_temp";
import NavBar from "../components_temp/Navbar_temp/NavBar_temp";

function HomeScreen() {
  return (
    <div>
      <NavBar />
      {/* inside header we should have login/register/bookmark/searchbar/movies link to category */}
      <Trending />
      <Recommended />
      HOMESCREEN
    </div>
  );
}

export default HomeScreen;
