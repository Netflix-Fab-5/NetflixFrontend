import React, { useState, useContext } from "react";
import Fuse from "fuse.js";
import { MyContext } from "../../constants/Context";

function SearchMovie() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("SearchMovie must be used within a MyContextProvider");
  }
  const { movies, loading, error } = context;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(Object.values(movies)); // Initialize with movies array

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
        <button type="submit">🔎</button>
      </form>
      <ul>
        {results.map((movie, index) => (
          <li key={index}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchMovie;
