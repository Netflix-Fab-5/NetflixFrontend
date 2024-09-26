// Import necessary dependencies
import { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

// Define the Movie type
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

// Define the User type for registration and login
interface User {
  username: string;
  email: string;
  password: string;
  favorites?: string[];
}

// Define the Context type
type ContextType = {
  movies: Record<string, Movie>;
  movie: Movie | null;
  favorites: Movie[];
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  success: boolean;
  registerUser: (user: User) => Promise<void>;
  addMovie: (movie: Movie) => Promise<void>;
  loginUser: (user: User) => Promise<void>;
  logoutUser: () => void;
  fetchMovieById: (id: string) => Promise<void>;
  addFavorite: (movie: Movie) => void; // Added to context
  removeFavorite: (movie: Movie) => void; // Added to context
};

// Create Context
const MyContext = createContext<ContextType>(null!);

// Create a provider component
function MyContextProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Record<string, Movie>>({});
  const [movie, setMovie] = useState<Movie | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null); // User ID state

  // Check login status from sessionStorage when the app starts
  useEffect(() => {
    const storedUser = sessionStorage.getItem("isLoggedIn");
    const storedUserId = sessionStorage.getItem("userId"); // Retrieve userId
    console.log("User ID:", storedUserId); // Log the user ID
    console.log(userId);

    if (storedUser === "true") {
      setIsLoggedIn(true);
      setUserId(storedUserId);

      // Log favorites when user is logged in
      const storedFavorites = sessionStorage.getItem("favorites");
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        console.log("Favorites:", favorites); // Log the favorite movies
        setFavorites(favorites); // Update the local favorites state if needed
      }
    }
  }, [userId]);

  // Fetch all movies from the API using Axios
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies.json",
        );
        setMovies(response.data); // Set the movies from the server
        setError(null);
      } catch (err) {
        setError(
          axios.isAxiosError(err)
            ? "Något gick fel vid hämtning av data"
            : "Okänt fel inträffade",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Fetch a specific movie based on its ID
  const fetchMovieById = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies/${id}.json`,
      );
      if (response.data) {
        const movieData = { ...response.data, id };
        setMovie(movieData);
        setError(null);
      }
    } catch (err) {
      console.log("Error fetching movie:", err);
      setError("Något gick fel vid hämtning av data");
    } finally {
      setLoading(false);
    }
  };

  // Register a user in Firebase
  const registerUser = async (newUser: User) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/users.json",
        newUser,
      );

      const userId = response.data.name;

      const registeredUser = {
        id: userId,
        username: newUser.username,
      };

      console.log("User registered:", registeredUser);

      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("userId", userId); // Store userId in sessionStorage
      setSuccess(true);
      setIsLoggedIn(true);
      setError(null);
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data.message || "Misslyckades med registrering."
          : "Okänt fel inträffade vid registrering",
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Add new Movie
  const addMovie = async (newMovie: Movie) => {
    setLoading(true);
    try {
      await axios.post(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies.json",
        newMovie,
      );
      setSuccess(true);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Misslyckades med att lägga till ny film. Försök igen.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Log in user and verify against Firebase
  const loginUser = async (user: User) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/users.json",
      );

      const usersData = response.data;

      let validUser = false;
      let userId = "";

      for (const key in usersData) {
        if (
          usersData[key].username === user.username &&
          usersData[key].password === user.password
        ) {
          validUser = true;
          userId = key;
          break;
        }
      }

      if (validUser) {
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userId", userId);
        setIsLoggedIn(true);
        setError(null);
      } else {
        setError("Felaktigt användarnamn eller lösenord");
      }
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data.message || "Misslyckades med inloggning."
          : "Okänt fel inträffade vid inloggning",
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Log out user
  const logoutUser = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userId"); // Clear userId on logout
    setIsLoggedIn(false);
  };

  // Add a movie to favorites
  const addFavorite = (movie: Movie) => {
    if (!favorites.find((fav) => fav.title === movie.title)) {
      const updatedFavorites = [...favorites, movie];
      setFavorites(updatedFavorites);
      // Optional: Implement the onBookmark function here if needed

      // Store updated favorites in session storage
      sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  // Remove movie from favorites
  const removeFavorite = (movie: Movie) => {
    const updatedFavorites = favorites.filter(
      (fav) => fav.title !== movie.title,
    );
    setFavorites(updatedFavorites);

    // Store updated favorites in session storage
    sessionStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <MyContext.Provider
      value={{
        movies,
        movie,
        favorites,
        loading,
        error,
        isLoggedIn,
        success,
        registerUser,
        addMovie,
        loginUser,
        logoutUser,
        fetchMovieById,
        addFavorite, // Include in context value
        removeFavorite, // Include in context value
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
