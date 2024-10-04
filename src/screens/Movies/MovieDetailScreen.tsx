import { useContext, useEffect } from "react";
import { MyContext } from "../../constants/context";
import { useParams, Link } from "react-router-dom"; // För att få filmens title från URL:en
import slugify from "slugify";
import { Movie } from "../../constants/types";
import { getRatingDescription } from "../../constants/ratingUtils";

function MovieDetails() {
  const { title } = useParams<{ title: string }>();
  const { movies, loading, error, handleFetchMovies } = useContext(MyContext); // movies istället för enskilt movie

  function createSlug(title: string) {
    return slugify(title, { lower: true, strict: true });
  }

  // Funktion för att avslugifiera och hitta rätt film
  function findMovieBySlug(
    movies: Record<string, Movie>,
    slug: string,
  ): Movie | undefined {
    const foundMovie = Object.values(movies).find((movie) => {
      const movieSlug = createSlug(movie.title);
      return movieSlug === slug;
    });
    return foundMovie;
  }

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
    <div className="w-full min-h-screen p-4 flex flex-col items-center bg-custom-dark">
      <div className="w-full flex justify-end mb-4">
        <Link to="/" className="button">
          <button className="button max-650:p-2 max-650:mb-2">
            Back to home
          </button>
        </Link>
      </div>

      {movie ? (
        <div className="rounded-lg shadow-md p-6 border border-green-300 max-w-4xl w-full bg-custom-background text-custom-text">
          <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
              <p className="text-lg mb-2">
                <strong>Synopsis:</strong> {movie.synopsis}
              </p>
              <p className="mb-2">
                <strong>Year:</strong> {movie.year}
              </p>
              <p className="mb-2">
                <strong>Age limit:</strong> {getRatingDescription(movie.rating)}
              </p>
              <p className="mb-2">
                <strong>Genre:</strong> {movie.genre}
              </p>
              <p className="mb-2">
                <strong>Actors:</strong> {movie.actors.join(", ")}
              </p>
            </div>

            {/* Movie Thumbnail */}
            <img
              src={movie.thumbnail}
              alt={movie.title}
              className="w-full h-auto rounded-lg shadow-lg border border-custom-green 
              md:order-2" /* This ensures the image stays next to the text on larger screens */
            />
          </div>
        </div>
      ) : (
        <p>No movie found</p>
      )}
    </div>
  );
}

export default MovieDetails;
