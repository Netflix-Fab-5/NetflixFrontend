import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Movie {
  title: string;
  year: number;
  rating: string;
  actors: string[];
  genre: string;
  synopsis: string;
  thumbnail: string;
}

const AllMoviesScreen = () => {
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

  // Renderingen av komponenten
  return (
    <div style={{ padding: '20px' }}>
      <h1>Alla Filmer</h1>

      {loading && <p>Laddar...</p>}
      {error && <p>Error: {error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {movies.map((movie, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <img
              src={movie.thumbnail}
              alt={movie.title}
              style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '10px' }}
            />
            <h3>{movie.title}</h3>
            <p><strong>År:</strong> {movie.year}</p>
            <p><strong>Genre:</strong> {movie.genre}</p>
            <p><strong>Skådespelare:</strong> {movie.actors.join(', ')}</p>
            <p><strong>Betyg:</strong> {movie.rating}</p>
            <p><strong>Synopsis:</strong> {movie.synopsis}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMoviesScreen;
