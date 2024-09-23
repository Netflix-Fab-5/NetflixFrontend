import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

// Definiera typ för en film
interface Movie {
  title: string;
  year: number;
  rating: string;
  actors: string[];
  genre: string;
  synopsis: string;
  thumbnail: string;
  isTrending: boolean;
}

// Definiera typ för Context-värdet
type ContextType = {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  movies: Movie[];
  loading: boolean;
  error: string | null;
};

// Skapa Context
const MyContext = createContext<ContextType | undefined>(undefined);

// Skapa en provider-komponent
function MyContextProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all movies from the API using Axios
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/movies');
        setMovies(response.data); // Sätter filmerna från servern
        setLoading(false); // Slutar visa laddning
      } catch (err: any) {
        setError(err.message || 'Något gick fel vid hämtning av data'); // Hanterar fel
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all movies from the API using Axios
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/movies');
        setMovies(response.data); // Sätter filmerna från servern
        setLoading(false); // Slutar visa laddning
      } catch (err: any) {
        setError(err.message || 'Något gick fel vid hämtning av data'); // Hanterar fel
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <MyContext.Provider value={{ movies, loading, error }}>
    <MyContext.Provider value={{ movies, loading, error }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };

