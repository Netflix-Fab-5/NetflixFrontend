import { createContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";

// Definiera typ för en film
export interface Movie {
  title: string;
  year: number;
  rating: string;
  actors: string[];
  genre: string;
  synopsis: string;
  thumbnail: string;
  isTrending: boolean;
}

// Definiera typ för användarregistrering och inloggning
interface User {
  username: string;
  email: string;
  password: string;
}

// Definiera typ för Context-värdet
type ContextType = {
  movies: Record<string, Movie>;
  movie: Movie | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  success: boolean;
  registerUser: (user: User) => void;
  addMovie: (movie: Movie) => void;
  loginUser: (user: User) => void;
  logoutUser: () => void;
  fetchMovieById: (id: string) => Promise<void>;
};

// Skapa Context
const MyContext = createContext<ContextType>(null!);

// Skapa en provider-komponent
function MyContextProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Record<string, Movie>>({});
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Kontrollera inloggningsstatus från sessionStorage/localStorage när appen startar
  useEffect(() => {
    const storedUser = sessionStorage.getItem("isLoggedIn");
    if (storedUser === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch all movies from the API using Axios
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies.json",
        );
        setMovies(response.data); // Sätter filmerna från servern
        setError(null);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError("Något gick fel vid hämtning av data"); // Hanterar fel
        } else {
          setError("okänt fel inträffade");
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
      setMovie(response.data); // Sätter den enskilda filmens data till state
      setError(null); // Nollställ eventuella tidigare fel
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError("Något gick fel vid hämtning av data"); // Hanterar fel
      } else {
        setError("okänt fel inträffade");
      }
    } finally {
      setLoading(false);
    }
  };

  // Registrera en användare i Firebase
  const registerUser = async (newUser: User) => {
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
      setSuccess(true);
      setIsLoggedIn(true);
      setError(null);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data.message ||
            "Failed to register user. Please try again.",
        );
      } else {
        setError("Okänt fel inträffade vid registrering");
      }
      setSuccess(false);
    }
  };

  //Add new Movie
  const addMovie = async (newMovie: Movie) => {
    try {
      // Send the movie data to Firebase Realtime Database
      await axios.post(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.om/movies.json", // .json is required for Firebase Realtime Database
        newMovie,
      );
      setSuccess(true);
      setError(null); // Clear the previous error msg if there any
    } catch (err) {
      console.log(err);
      setError("Failed to add new movie. Please try again.");
      setSuccess(false); // Clear the previous success msg if there any
    }
  };

  // Logga in användare och kontrollera mot Firebase
  const loginUser = async (user: User) => {
    try {
      // Hämta användardata från Firebase Realtime Database
      const response = await axios.get(
        "https://netflix-dupe-942ea-default-rtdb.firebaseio.com/users.json",
      );

      // Kontrollera om användarnamn och lösenord matchar någon post i Firebase
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
        // Hantera fel om inloggningsuppgifterna inte matchar
        setError("Felaktigt användarnamn eller lösenord");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data.message ||
            "Failed to login user. Please try again.",
        );
      } else {
        setError("Okänt fel inträffade vid inloggning");
      }
      setSuccess(false);
    }
  };

  // Logga ut användaren
  const logoutUser = () => {
    sessionStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <MyContext.Provider
      value={{
        movies,
        movie,
        loading,
        error,
        isLoggedIn,
        success,
        registerUser,
        addMovie,
        loginUser,
        logoutUser,
        fetchMovieById,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
