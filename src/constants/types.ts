import { User } from "firebase/auth"; // Importera User-typen från Firebase

export interface Movie {
  id: string;
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
export type ContextType = {
  movies: Record<string, Movie>;
  movie: Movie | null;
  favorites: Movie[];
  loading: boolean;
  error: string | null;
  success: boolean;
  user: User | null; // Lägger till användarens state
  addMovie: (movie: Movie) => Promise<void>;
  handleLoginUser: (user: { email: string; password: string }) => Promise<void>;
  handleLogoutUser: () => void;
  handleFetchMovieById: (id: string) => Promise<Movie | null>;
  addFavorite: (movie: Movie) => void; // Funktion för att lägga till favoriter
  removeFavorite: (movie: Movie) => void; // Funktion för att ta bort favoriter
};
