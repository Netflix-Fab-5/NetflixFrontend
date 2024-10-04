import { useContext, useState, useEffect } from "react";
import { MyContext } from "../../constants/context";
import MovieCarousel from "./MovieCarousel";
import { Movie } from "../../constants/types";

// Funktion för att slumpa fram ett antal filmer från en lista
const getRandomMovies = (movies: Movie[], count: number) => {
  const shuffled = [...movies].sort(() => 0.5 - Math.random()); // Blanda filmerna
  return shuffled.slice(0, count); // Returnera det angivna antalet filmer
};

const Recommended = () => {
  const { movies } = useContext(MyContext);
  const [randomRecommendedMovies, setRandomRecommendedMovies] = useState<
    Movie[]
  >([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);

  // Filtrera fram de rekommenderade filmerna (exempelvis de som inte trendar)
  useEffect(() => {
    const filteredMovies = Object.values(movies || {}).filter(
      (movie) => !movie.isTrending,
    );
    setRecommendedMovies(filteredMovies);
  }, [movies]);

  // Slumpa fram 8 filmer endast när komponenten laddas första gången
  useEffect(() => {
    if (recommendedMovies.length > 0) {
      const randomMovies = getRandomMovies(recommendedMovies, 8);
      setRandomRecommendedMovies(randomMovies);
    }
  }, [recommendedMovies]);

  return (
    <div className="mb-8">
      {" "}
      {/* Marginal under sektionen */}
      <div className="flex items-center mb-4 justify-center lg:justify-start lg:pl-48">
        {" "}
        {/* Flex container för titel och ikon */}
        <i
          className="fas fa-star"
          style={{
            color: "gold", // Ikonfärg
            fontSize: "24px", // Ikonstorlek
          }}
        ></i>
        <h2 className="text-2xl font-bold ml-2">
          {" "}
          {/* Titeln storlek och stil */}
          Recommended Movies
        </h2>
      </div>
      <MovieCarousel
        movies={randomRecommendedMovies}
        title={"Trending movies"}
      />
    </div>
  );
};

export default Recommended;
