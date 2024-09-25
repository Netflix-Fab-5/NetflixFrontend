import { useContext, useEffect } from "react";
import { MyContext } from "../constants/context";
import { useParams } from "react-router-dom"; // För att få filmens ID från URL:en

function MovieDetails() {
  const { id } = useParams(); // Anta att id kommer från URL:en
  const { movie, fetchMovieById, loading, error } = useContext(MyContext);

  useEffect(() => {
    if (id) {
      fetchMovieById(id);
    }
  }, [id, fetchMovieById]);

  //if (loading) return <p>Loading...</p>;
  //if (error) return <p>{error}</p>;

  return (
    <div>
      {movie ? (
        <div>
          <h1>{movie.title}</h1>
          <img
            src={movie.thumbnail}
            alt={movie.title}
            style={{ width: "20%", borderRadius: "8px", marginBottom: "20px" }}
          />
          <p>{movie.synopsis}</p>
          <p>Year: {movie.year}</p>
          <p>Rating: {movie.rating}</p>
          <p>Genre: {movie.genre}</p>
          <p>Actors: {movie.actors.join(", ")}</p>
        </div>
      ) : (
        <p>No movie found</p>
      )}
    </div>
  );
}

export default MovieDetails;
