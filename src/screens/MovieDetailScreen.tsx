import { useContext, useEffect } from "react";
import { MyContext } from "../constants/context";
import { useParams, Link } from "react-router-dom"; // För att få filmens ID från URL:en

function MovieDetails() {
  const { id } = useParams();
  const { movie, fetchMovieById, loading, error } = useContext(MyContext);

  useEffect(() => {
    console.log("Fetching movie with ID:", id);
    if (id && (!movie || movie.id !== id)) {
      console.log("Fetching movie with ID:", id);
      fetchMovieById(id);
    }
  }, [id, fetchMovieById, movie]);

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
            className="w-1/3 h-auto rounded-lg mr-6" // Justera storleken på bilden
          />
          <div className="w-2/3">
            {" "}
            {/* Texten tar upp 2/3 av utrymmet */}
            <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
            <p className="text-lg mb-2">
              <strong>Synopsis:</strong> {movie.synopsis}
            </p>
            <p className="mb-2">
              <strong>Year:</strong> {movie.year}
            </p>
            <p className="mb-2">
              <strong>Rating:</strong> {movie.rating}
            </p>
            <p className="mb-2">
              <strong>Genre:</strong> {movie.genre}
            </p>
            <p className="mb-2">
              <strong>Actors:</strong> {movie.actors.join(", ")}
            </p>
          </div>
        </div>
      ) : (
        <p>No movie found</p>
      )}
    </div>
  );
}

export default MovieDetails;
