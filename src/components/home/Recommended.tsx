import { useContext } from "react";
import { MyContext } from "../../constants/context";
import MovieCarousel from "./MovieCarousel";

const Recommended = () => {
  const { movies } = useContext(MyContext);

  // Filtrera fram de rekommenderade filmerna (exempelvis de som inte trendar)
  const recommendedMovies = Object.values(movies || {}).filter(
    (movie) => !movie.isTrending, // Här antar jag att rekommenderade filmer är de som inte trendar, ändra logiken om det behövs
  );

  return (
    <MovieCarousel movies={recommendedMovies} title="Recommended Movies" />
  );
};

export default Recommended;
