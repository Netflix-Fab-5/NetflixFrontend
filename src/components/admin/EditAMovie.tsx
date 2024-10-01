import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Movie } from "../../constants/types";
import { MyContext } from "../../constants/context";

function EditAMovie() {
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const { handleFetchMovieById, editMovie, error, success, loading } =
    useContext(MyContext);
  console.log(movieId);

  // UseEffect to fetch the movie data when the component loads
  useEffect(() => {
    const fetchMovieData = async () => {
      if (movieId) {
        try {
          const movieData = await handleFetchMovieById(movieId);
          console.log(movieData);
          setMovie(movieData);
        } catch (error) {
          console.error("Error fetching movie data:", error);
        }
      }
    };
    fetchMovieData();
  }, [handleFetchMovieById, movieId]);

  if (loading) {
    return <div>Laddar...</div>;
  }

  if (!movie) {
    return <div>Movie not found, check your ID</div>;
  }

  // Handle form inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMovie((prev) => (prev ? { ...prev, [name]: value } : prev));
  };

  const handleActorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const actors = e.target.value.split(",").map((actor) => actor.trim());
    setMovie((prev) => (prev ? { ...prev, actors } : prev));
  };

  const handleTrendingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovie((prev) =>
      prev ? { ...prev, isTrending: e.target.checked } : prev,
    );
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieId) return;
    const updatedMovie = {
      ...movie,
      isTrending: movie.isTrending !== undefined ? movie.isTrending : false,
    };

    await editMovie(movieId, updatedMovie);
  };

  // Delete movie hadle
  const handleDelete = () => {
    console.log("call your delete route here");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          marginBottom: "40px",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Home
          </button>
        </Link>
      </div>
      <div className="bg-white mt-20 p-8 text-green-600 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit the Movie</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Title:</label>
            <input
              type="text"
              name="title"
              value={movie.title}
              onChange={handleInputChange}
              required
              className="mt-1 bg-transparent p-2 w-2/3 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Year:</label>
            <input
              type="number"
              name="year"
              value={movie.year}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 w-2/3 bg-transparent border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Rating:</label>
            <input
              type="text"
              name="rating"
              value={movie.rating}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 w-2/3 bg-transparent border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Actors:</label>
            <input
              type="text"
              name="actors"
              value={movie.actors.join(", ")}
              onChange={handleActorsChange}
              required
              className="mt-1 p-2 w-2/3 bg-transparent border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Genre:</label>
            <input
              type="text"
              name="genre"
              value={movie.genre}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 w-2/3 bg-transparent border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Synopsis:</label>
            <textarea
              name="synopsis"
              value={movie.synopsis}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 w-2/3 bg-transparent border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Thumbnail URL:</label>
            <input
              type="text"
              name="thumbnail"
              value={movie.thumbnail}
              onChange={handleInputChange}
              required
              className="mt-1 p-2 w-2/3 bg-transparent border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Is Trending:</label>
            <input
              type="checkbox"
              name="isTrending"
              checked={!!movie?.isTrending}
              onChange={handleTrendingChange}
              className="mt-1"
            />
          </div>

          <div className="flex flex-col space-y-4 sm:flex-row justify-center items-center sm:space-y-0 sm:space-x-4">
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 sm:w-auto"
            >
              Update Movie
            </button>
            <button
              onClick={handleDelete}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 sm:w-auto"
            >
              Delete Movie
            </button>
          </div>
        </form>
        {success && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            Movie updated successfully
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default EditAMovie;
