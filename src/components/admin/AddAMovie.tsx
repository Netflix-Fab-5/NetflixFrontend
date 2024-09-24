import React, { useState } from "react";
import axios from "axios";

// Movie interface
interface Movie {
  title: string;
  year: number;
  rating: string;
  actors: string[];
  genre: string;
  synopsis: string;
  thumbnail: string;
}

function AddAMovie() {
  const [movie, setMovie] = useState<Movie>({
    title: "",
    year: 2000,
    rating: "",
    actors: [""],
    genre: "",
    synopsis: "",
    thumbnail: "",
  });

  // Handle for input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMovie((prev) => ({
      ...prev,
      [name]: value,
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

  // Handle form submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send the user data to Firebase Realtime Database
      const response = await axios.post(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies.json", // .json is required for Firebase Realtime Database
        movie,
      );
      console.log("Movie added successfully :", response);
    } catch (err) {
      console.error("Failed to add new movie. Please try again.", err);
    }
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

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Add A New Movie
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddAMovie;
