import React, { useState, useContext, useEffect } from "react";
import Fuse from "fuse.js";
import { MyContext } from "../../constants/context";

function SearchMovie() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("SearchMovie must be used within a MyContextProvider");
  }
  const { movies, loading, error } = context;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(Object.values(movies)); // Initialize with movies array

  // Nollställ resultaten när komponenten laddas om eller när query rensas
  useEffect(() => {
    if (!query) {
      setResults([]); // Töm resultatlistan när sökningen är tom
    }
  }, [query]);

  const fuse = new Fuse(Object.values(movies), {
    keys: ["title"],
    threshold: 0.5,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    const result = fuse.search(value).map(({ item }) => item);
    setResults(result);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="Search Movie Name from here"
          value={query}
          onChange={handleSearch}
        />
      </form>
      <ul>
        {results.length > 0 &&
          Object.values(results).map((movie, index) => (
            <li key={index}>{movie.title}</li>
          ))}
      </ul>
    </div>
  );
}

export default SearchMovie;
