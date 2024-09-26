import { ref, get, push } from "firebase/database"; // Modulära importer
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

export const addMovie = async (newMovie: Movie) => {
  const moviesRef = ref(database, "movies"); // Skapa en referens till "movies"
  await push(moviesRef, newMovie); // Lägg till filmen i databasen
};
