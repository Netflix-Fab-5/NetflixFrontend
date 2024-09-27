import React, { useState, useContext, useEffect } from "react";
import Fuse from "fuse.js";
import { MyContext } from "../../constants/context";
import { Movie } from "../../constants/types";

function SearchMovie() {
  const { movies, loading, error } = useContext(MyContext); // Använd context för att hämta filmer, loading och error
  const [query, setQuery] = useState<string>(""); // Söksträngen
  const [results, setResults] = useState<Movie[]>([]); // Resultatlista baserad på Movie-typen

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
          results.map((movie, index) => <li key={index}>{movie.title}</li>)}
      </ul>
    </div>
  );
}

export default SearchMovie;
