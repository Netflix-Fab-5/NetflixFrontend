import { useContext } from "react";
import { MyContext } from "../../constants/context";
import MovieCarousel from "./MovieCarousel";

const Trending = () => {
  const { movies } = useContext(MyContext);

  // Filtrera de trenderande filmerna
  const trendingMovies = Object.values(movies || {}).filter(
    (movie) => movie.isTrending,
  );

  return (
    <div className="mb-8">
      {" "}
      {/* Marginal under sektionen */}
      <div className="flex items-center mb-4 justify-center lg:justify-start lg:pl-48">
        {" "}
        {/* Flex container för titel och ikon */}
        <i className="fas fa-arrow-up text-green-500 text-2xl"></i>{" "}
        {/* Ikonfärg och storlek */}
        <h2 className="text-2xl font-bold ml-2">
          {" "}
          {/* Titeln storlek och stil */}
          Trending Movies
        </h2>
      </div>
      <MovieCarousel movies={trendingMovies} title={"Trending movies"} />
    </div>
  );
};

export default Trending;
