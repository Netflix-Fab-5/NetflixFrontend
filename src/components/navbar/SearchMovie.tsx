import React, { useState, useContext, useEffect } from "react";
import Fuse from "fuse.js";
import { MyContext, Movie } from "../../constants/context";

function SearchMovie() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("SearchMovie must be used within a MyContextProvider");
  }
  const { movies, loading, error } = context;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]); // Använd Movie[] för results-typen

  const fuse = new Fuse(Object.values(movies), {
    keys: ["title"],
    threshold: 0.5,
  });

  // Nollställ resultaten när query är tomt
  useEffect(() => {
    if (!query) {
      setResults([]); // Töm resultatlistan när sökningen är tom
    }
  }, [query]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Results:", results);
    const value = e.target.value;
    setQuery(value);

    if (value) {
      const result: Movie[] = fuse
        .search(value)
        .map(({ item }) => item as Movie);
      setResults(result);
    } else {
      setResults([]); // Nollställ resultat om query är tomt
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="relative p-4">
      <form className="mb-4">
        <input
          type="text"
          placeholder="Search Movie Name from here"
          value={query}
          onChange={handleSearch}
          className="w-72 mx-auto block px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </form>
      <ul
        className="absolute left-0 right-0 mx-auto w-80 bg-white shadow-lg rounded-md divide-y divide-gray-200 z-50"
        style={{ maxHeight: "425px", overflowY: "auto" }} // Justera för att visa 3,5 filmer
      >
        {" "}
        {results.length > 0 &&
          results.map((movie) => (
            <li
              key={movie.id}
              className="p-4 hover:bg-gray-100 flex items-center"
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-8 h-12 object-cover rounded-md mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-500">
                  {movie.year} | {movie.rating}
                </p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default SearchMovie;
