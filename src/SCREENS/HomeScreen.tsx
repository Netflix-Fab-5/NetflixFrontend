import Trending from "../components/Home/Trending";
import Recommended from "../components/Home/Recommended";
import NavBar from "../components/Navbar/NavBar";

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
