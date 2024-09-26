import { useContext } from "react";
import { Movie, MyContext } from "../../constants/context";
import MovieCarousel from "./MovieCarousel";

const Trending = () => {
  const { movies, addFavorite } = useContext(MyContext);

  // Filter the trending movies
  const trendingMovies = Object.values(movies || {}).filter(
    (movie) => movie.isTrending
  );

  // Handle bookmarking a movie
  const handleBookmark = (movie: Movie) => {
    addFavorite(movie);
  };

  return (
    <MovieCarousel
      movies={trendingMovies}
      title="Trending Movies"
      onBookmark={handleBookmark}  // Pass the handler to MovieCarousel
    />
  );
};

export default Trending;
