import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../constants/context"; // Import Movie interface
import { Movie } from "../../constants/types";
import { Link } from "react-router-dom";

function AddAMovie() {
  const { error, success, setSuccess, addMovie } = useContext(MyContext)!;
  const [showSuccess, setShowSuccess] = useState(false);
  const [actorsInput, setActorsInput] = useState("");

  // Initial state of movie
  const initialMovie: Movie = {
    title: "",
    year: 2000,
    rating: "",
    actors: [],
    genre: "",
    synopsis: "",
    thumbnail: "",
    isTrending: false,
  };

  const [movie, setMovie] = useState<Movie>(initialMovie);

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
    setActorsInput(e.target.value); // Hantera skådespelarnas inmatning som en sträng
  };

  // Handle for isTrending checkbox
  function handleTrendingChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMovie((prev) => ({
      ...prev,
      isTrending: e.target.checked, // Update isTrending on the basis of checkbox
    }));
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const movieToAdd = {
      ...movie,
      actors: actorsInput.split(",").map((actor) => actor.trim()), // Separera här
    };
    addMovie(movieToAdd); // Add new movie in firesbase
    setMovie(initialMovie); // Reset form with initial state
    setActorsInput("");
  }

  // Hide success msg after 15 sec
  useEffect(
    function () {
      if (success) {
        console.log(success);
        setShowSuccess(true);
        setSuccess(false);
        const timer = setTimeout(function () {
          setShowSuccess(false);
        }, 15000);

        // Cleanup the timeout when success changes
        return function () {
          clearTimeout(timer);
        };
      }
    },
    [success, showSuccess, setSuccess],
  );

  return (
    <div className="flex justify-center text-green-600 items-center min-h-screen bg-black text-xl">
      <div className="absolute top-5 right-5 mb-10 ">
        <Link to="/" className="no-underline">
          <button className="button">Home</button>
        </Link>
      </div>

      <div className="bg-white p-8 text-green-600 rounded-lg shadow-md w-full max-w-lg max-650:m-4 max-650:mt-16 sm:mt-16 lg:mt-16 md:mt-16">
        <h2 className="text-3xl  font-bold mb-6 text-center">Add a Movie</h2>
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
              value={actorsInput}
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
              className="mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-800"
          >
            Add A New Movie
          </button>
        </form>
        {showSuccess && (
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
