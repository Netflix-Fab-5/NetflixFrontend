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
  favorites: string[];
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
  registerUser: (user: User) => void;
  addMovie: (movie: Movie) => void;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  fetchMovieById: (id: string) => Promise<void>;
  addFavorite: (movie: Movie) => void;
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

  // Kontrollera inloggningsstatus från sessionStorage/localStorage när appen startar
  useEffect(() => {
    const storedUser = sessionStorage.getItem("isLoggedIn");
    if (storedUser === "true") {
      setIsLoggedIn(true);
    }});
    
  const [userId, setUserId] = useState<string | null>(null); // Add userId state

  // Check login status from sessionStorage/localStorage when the app starts
  useEffect(() => {
    const storedUser = sessionStorage.getItem("isLoggedIn");
    const storedUserId = sessionStorage.getItem("userId"); // Retrieve userId
    if (storedUser === "true") {
      setIsLoggedIn(true);
      setUserId(storedUserId); // Set userId if logged in
    }
  }, []);

  // Fetch all movies from the API using Axios
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies.json"
        );
        setMovies(response.data); // Set the movies from the server
        setError(null);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError("Något gick fel vid hämtning av data");
        } else {
          setError("Okänt fel inträffade");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Funktion för att hämta en specifik film baserat på dess ID
  const fetchMovieById = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies/${id}.json`,
      );
      if (response.data) {
        const movieData = {
          ...response.data,
          id,
        };
        setMovie(movieData);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching movie:", err);
      setError("Något gick fel vid hämtning av data");
    } finally {
      setLoading(false);
    }
  };

  // Registrera en användare i Firebase
  // Register a user in Firebase
  const registerUser = async (newUser: User) => {
    try {
      const response = await axios.post(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/users.json",
        newUser
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
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data.message || "Failed to register user. Please try again."
        );
      } else {
        setError("Okänt fel inträffade vid registrering");
      }
      setSuccess(false);
    }
  };

  // Add new Movie
  const addMovie = async (newMovie: Movie) => {
    try {
      await axios.post(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies.json",
        newMovie
      );
      setSuccess(true);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Failed to add new movie. Please try again.");
      setSuccess(false);
    }
  };

  

      // Kontrollera om användarnamn och lösenord matchar någon post i Firebase
  // Add a movie to the favorites list
  const addFavorite = async (movie: Movie) => {
    // Check if the movie is already in favorites
    if (!favorites.find((fav) => fav.title === movie.title)) {
      const updatedFavorites = [...favorites, movie]; // Update local state

      setFavorites(updatedFavorites);  // Update local state

      // Only update the database if the user is logged in
      if (isLoggedIn && userId) {
        try {
          // Update the user's favorite movies in Firebase
          await axios.patch(
            `https://netflix-dupe-942ea-default-rtdb.firebaseio.com/users/${userId}.json`,
            { favorites: updatedFavorites }  // Update the favorites array
          );
        } catch (error) {
          console.error("Error updating favorites in Firebase:", error);
        }
      }
    }
  };

  // Log in user and verify against Firebase
  const loginUser = async (user: User) => {
  try {
    const response = await axios.get(
      "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/users.json"
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
      // Om inloggningen lyckas, uppdatera inloggningsstatus
      sessionStorage.setItem("isLoggedIn", "true");
      sessionStorage.setItem("username", user.username);
      sessionStorage.setItem("userId", userId);
      setIsLoggedIn(true);
      setError(null);
    } else {
      // Om användarnamnet eller lösenordet är felaktigt
      setError("Felaktigt användarnamn eller lösenord");
    }
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(
        err.response?.data.message || "Failed to login user. Please try again."
      );
    } else {
      setError("Okänt fel inträffade vid inloggning");
    }
    setSuccess(false);
  }
};


  // Log out user
  const logoutUser = () => {
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userId"); // Clear userId on logout
    setIsLoggedIn(false);
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
        addFavorite,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };