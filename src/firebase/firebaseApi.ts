import { ref, get, push, set } from "firebase/database"; // Modulära importer
import { database } from "./firebase"; // Importerar den redan initierade databasen från firebase.ts
import { Movie } from "../constants/types";

export const fetchMovies = async (): Promise<Record<string, Movie>> => {
  const moviesRef = ref(database, "movies"); // Skapa en referens till "movies"
  const snapshot = await get(moviesRef); // Hämta datan
  const movies = snapshot.val();
  return movies;
};

export const fetchMovieById = async (id: string): Promise<Movie | null> => {
  const movieRef = ref(database, `movies/${id}`); // Skapa en referens till en specifik film
  const snapshot = await get(movieRef); // Hämta datan
  const movieData = snapshot.val();

  return movieData ? { ...movieData, id } : null;
};

export const fetchMovieByTitle = async (title: string): Promise<Movie | null> => {
   const moviesRef = ref(database, 'movies'); // Reference to the "movies" collection
  const snapshot = await get(moviesRef); // Fetch all movies
  const moviesData = snapshot.val();

  if (moviesData) {
    const movieId = Object.keys(moviesData).find(id => moviesData[id].title === title); // Find the movie by title
    if (movieId) {
      const movie = moviesData[movieId]; // Access the movie data
     return { ...movie, id: movieId } as Movie & { id: string };
    }
  }

  return null; // Return null if no movie was found
};

export const addMovie = async (newMovie: Movie) => {
  const moviesRef = ref(database, "movies"); // Skapa en referens till "movies"
  await push(moviesRef, newMovie); // Lägg till filmen i databasen
};

// Edit a movie
export const editMovie = async (movieId: string, updatedMovie: Movie) => {
  const movieRef = ref(database, `movies/${movieId}`); // Reference to the specific movie to edit
  await set(movieRef, updatedMovie); // Update the movie data

  return updatedMovie; // Return the updated movie for confirmation
};
// Hämtar alla kategorier (genrer) från Firebase
export const fetchGenres = async (): Promise<string[]> => {
  const moviesRef = ref(database, "movies"); // Referens till "movies"-noden i databasen
  const snapshot = await get(moviesRef); // Hämta data från Firebase
  const movies = snapshot.val(); // Extrahera filmerna från snapshot

  console.log("Movies fetched from database:", movies); // Logga filmerna

  // Skapa en Set för att hålla unika genrer
  const genreSet = new Set<string>();

  // Kontrollera om movies är tomt
  if (!movies) {
    console.warn("No movies found in database."); // Varna om inga filmer hittas
    return [];
  }

  // Iterera genom filmerna och extrahera genrer
  Object.values(movies).forEach((movie) => {
    const typedMovie = movie as Movie;
    if (typedMovie.genre) {
      const genres = typedMovie.genre
        .split(",")
        .map((genre: string) => genre.trim()); // Dela genrer vid kommatecken och trimma mellanslag
      genres.forEach((genre: string) => genreSet.add(genre)); // Lägg till varje unik genre i setet
    }
  });

  // Konvertera Set till en array och returnera den
  return Array.from(genreSet);
};
