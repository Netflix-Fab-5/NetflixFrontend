import React, { useContext, useState } from "react";
import { MyContext, Movie } from "../../constants/context"; // Import Movie interface

function AddAMovie() {
  const { error, success, addMovie } = useContext(MyContext)!;

  // Using Movie from context
  const [movie, setMovie] = useState<Movie>({
    id: Math.random().toString(36).substr(2, 9),
    title: "",
    year: 2000,
    rating: "",
    actors: [""],
    genre: "",
    synopsis: "",
    thumbnail: "",
    isTrending: false,
  });

  // Handle for input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMovie((prev) => ({
      ...prev,
      [name]: value, // Update the relevant field
    }));
  };

  // Handle actors input as it hase more than one value
  const handleActorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const actors = e.target.value.split(",").map((actor) => actor.trim());
    setMovie((prev) => ({
      ...prev,
      actors,
    }));
  };

  // Handle for isTrending checkbox
  const handleTrendingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMovie((prev) => ({
      ...prev,
      isTrending: e.target.checked, // Update isTrending on the basis of checkbox
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addMovie(movie); // Add new movie in firesbase
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 text-red-600 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl  font-bold mb-6 text-center">Add a Movie</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Title:</label>
            <input
              type="text"
              name="title"
              value={movie.title}
              onChange={handleInputChange}
              required
              data-testid="title-input"
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
              data-testid="year-input"
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
              data-testid="rating-input"
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
              data-testid="actor-input"
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
              data-testid="genre-input"
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
              data-testid="synopsis-input"
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
              data-testid="thumbnail-input"
              className="mt-1 p-2 w-2/3 bg-transparent border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 w-1/3">Is Trending:</label>
            <input
              type="checkbox"
              name="isTrending"
              checked={movie.isTrending}
              data-testid="trending-input"
              onChange={handleTrendingChange}
              className="mt-1 w-2/3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Add A New Movie
          </button>
        </form>
        {success && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
            Movie added successfully
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

export default AddAMovie;
