import Trending from "../../components/home/Trending";
import Recommended from "../../components/home/Recommended";
import NavBar from "../../components/common/NavBar";
import { useEffect, useContext } from "react";
import { MyContext } from "../../constants/context";
import { useAuth } from "../../hooks/useAuth";

function HomeScreen() {
  const { handleFetchMovies, loading, error } = useContext(MyContext);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      handleFetchMovies(); // Hämta filmer när användaren är inloggad
    }
  }, [user, handleFetchMovies]); // Körs när user ändras (dvs. när användaren loggar in)

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
      <Trending />
      <Recommended />
    </div>
  );
}

export default HomeScreen;
