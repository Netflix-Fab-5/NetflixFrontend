import Trending from "../components/home/Trending";
import Recommended from "../components/home/Recommended";
import NavBar from "../components/navbar/NavBar";

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
