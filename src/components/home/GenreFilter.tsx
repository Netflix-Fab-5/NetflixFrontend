import React, { useState, useContext } from "react";
import { MyContext } from "../../constants/context";

const GenreFilter: React.FC = () => {
  const { genres, filterMoviesByGenre } = useContext(MyContext); // Använder dynamiska genrer från context
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  // Hantera genre-val
  const handleGenreSelect = (genre: string) => {
    let updatedGenres;
    if (selectedGenres.includes(genre)) {
      updatedGenres = selectedGenres.filter((g) => g !== genre);
    } else {
      updatedGenres = [...selectedGenres, genre];
    }
    setSelectedGenres(updatedGenres);
    filterMoviesByGenre(updatedGenres); // Filtrera filmer baserat på valda genrer
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-between w-48 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          Categories
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {showDropdown && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1 max-h-40 overflow-y-auto" role="none">
            {genres.map((genre) => (
              <div
                key={genre}
                className="cursor-pointer flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleGenreSelect(genre)}
              >
                {selectedGenres.includes(genre) && (
                  <svg
                    className="h-4 w-4 text-blue-500 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {genre}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenreFilter;
