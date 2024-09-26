import { useContext } from "react";
import { MyContext } from "../../constants/context";
import MovieCarousel from "./MovieCarousel";

const Trending = () => {
  const { movies } = useContext(MyContext);

  // Filter the trending movies
  const trendingMovies = Object.values(movies || {}).filter(
    (movie) => movie.isTrending,
  );

  return <MovieCarousel movies={trendingMovies} title="Trending Movies" />;
};

export default Trending;
