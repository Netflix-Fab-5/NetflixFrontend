import { useContext, useEffect } from "react";
import { MyContext } from "../constants/context";
import { useParams, Link } from "react-router-dom"; // För att få filmens title från URL:en
import slugify from "slugify";
import { Movie } from "../constants/types";
import { getRatingDescription } from "../constants/ratingUtils";

function MovieDetails() {
  const { title } = useParams<{ title: string }>();
  const { movies, loading, error, handleFetchMovies } = useContext(MyContext); // movies istället för enskilt movie

  const createSlug = (title: string) => {
    return slugify(title, { lower: true, strict: true });
  };

  // Funktion för att avslugifiera och hitta rätt film
  const findMovieBySlug = (
    movies: Record<string, Movie>,
    slug: string,
  ): Movie | undefined => {
    return Object.values(movies).find(
      (movie) => createSlug(movie.title) === slug,
    );
  };

  const movie = findMovieBySlug(movies, title || ""); // Hitta filmen baserat på title-slug

  useEffect(() => {
    if (!movie) {
      handleFetchMovies(); // Hämta filmer om ingen matchande film hittas
    }
  }, [movie, handleFetchMovies]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!movie) return <p>No movie found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        to="/movies"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        Tillbaka till filmer
      </Link>
      {movie ? (
        <div className="bg-white rounded-lg shadow-md p-6 flex">
          <img
            src={movie.thumbnail}
            alt={movie.title}
            className="w-1/3 h-auto rounded-lg mr-6"
          />
          <div className="w-2/3">
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <p className="text-lg mb-2">
              <strong>Synopsis:</strong> {movie.synopsis}
            </p>
            <p className="mb-2">
              <strong>År:</strong> {movie.year}
            </p>
            <p>
              <strong>Age limit:</strong>{" "}
              {getRatingDescription(movie?.rating || "")}
            </p>
            <p className="mb-2">
              <strong>Genre:</strong> {movie.genre}
            </p>
            <p className="mb-2">
              <strong>Skådespelare:</strong> {movie.actors.join(", ")}
            </p>
          </div>
        </div>
      ) : (
        <p>Ingen film hittad</p>
      )}
    </div>
  );
}

export default MovieDetails;
