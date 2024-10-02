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
    <div style={{ marginBottom: "2rem" }}>
      {" "}
      {/* Marginal under sektionen */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
          paddingLeft: "190px",
        }}
      >
        {" "}
        {/* Flex container för titel och ikon */}
        <i
          className="fas fa-star"
          style={{
            color: "gold", // Ikonfärg
            fontSize: "24px", // Ikonstorlek
          }}
        ></i>
        <h2
          style={{
            fontSize: "24px", // Titeln storlek
            fontWeight: "bold", // Fet stil
            marginLeft: "10px", // Avstånd mellan ikon och titel
          }}
        >
          Recommended Movies
        </h2>
      </div>
      <MovieCarousel
        movies={randomRecommendedMovies}
        title={"Recommended movies"}
      />
    </div>
  );
};

export default Recommended;
