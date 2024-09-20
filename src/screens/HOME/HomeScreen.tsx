import Trending from "./Trending";
import Recommended from "./Recommended";
import NavBar from "../../Layout/NavBar";

function HomeScreen() {
  return (
    <div>
      <NavBar />
      {/* inside header we should have login/register/bookmark/searchbar/movies link to category */}
      <Trending />
      <Recommended />
      HOMESCREEN test lägger till ett ord
    </div>
  );
}

export default HomeScreen;
