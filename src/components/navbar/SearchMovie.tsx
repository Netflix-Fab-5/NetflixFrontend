import React, { useState, useContext, useEffect } from "react";
import Fuse from "fuse.js";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../constants/context";
import { Movie } from "../../constants/types";

// Funktion för att omvandla titeln till en URL-vänlig sträng (slug)
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

function SearchMovie() {
  const { movies, loading, error } = useContext(MyContext); // Använd context för att hämta filmer, loading och error
  const [query, setQuery] = useState<string>(""); // Söksträngen
  const [results, setResults] = useState<Movie[]>([]); // Resultatlista baserad på Movie-typen
  const navigate = useNavigate();

  const fuse = new Fuse(movies ? Object.values(movies) : [], {
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

  const handleSearchClick = (title: string) => {
    const slug = createSlug(title); // Konvertera titeln till en slug
    navigate(`/movies/${slug}`); // Navigera till /movies/slug
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
        style={{ maxHeight: "425px", overflowY: "auto" }}
      >
        {" "}
        {results.length > 0 &&
          results.map((movie, index) => (
            <li
              key={movie.id ? movie.id : index}
              className="p-4 hover:bg-gray-100 flex items-center"
              onClick={() => handleSearchClick(movie.title)}
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-8 h-12 object-cover rounded-md mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-left">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-500 text-left">
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
