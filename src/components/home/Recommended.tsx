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
  }, [movies]); // Denna körs när movies uppdateras

  // Slumpa fram 8 filmer endast när komponenten laddas första gången
  useEffect(() => {
    if (recommendedMovies.length > 0) {
      const randomMovies = getRandomMovies(recommendedMovies, 8);
      setRandomRecommendedMovies(randomMovies);
    }
  }, [recommendedMovies]); // Denna körs när recommendedMovies uppdateras

  return (
    <MovieCarousel
      movies={randomRecommendedMovies}
      title="Recommended Movies"
    />
  );
};

export default Recommended;
