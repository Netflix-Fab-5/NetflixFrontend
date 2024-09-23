import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

// Definiera typ för användarregistrering och inloggning
interface User {
  username: string;
  email: string;
  password: string;
}

// Definiera typ för Context-värdet
type ContextType = {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  success: boolean;
  registerUser: (user: User) => void;
};

// Skapa Context
const MyContext = createContext<ContextType | undefined>(undefined);



// Skapa en provider-komponent
function MyContextProvider({ children }: { children: ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch all movies from the API using Axios
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('https://netflix-dupe-942ea-default-rtdb.firebaseio.com/movies.json');
        setMovies(response.data); // Sätter filmerna från servern
        setLoading(false); // Slutar visa laddning
      } catch (err: any) {
        setError(err.message || 'Något gick fel vid hämtning av data'); // Hanterar fel
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Registrera en användare i Firebase
  const registerUser = async (newUser: User) => {
    try {
      // Skicka användarens data till Firebase
      const response = await axios.post(
        'https://netflix-dupe-942ea-default-rtdb.firebaseio.com/users.json',
        newUser
      );
  
      const userId = response.data.name; // Detta är det unika ID:t från Firebase
  
      // Spara användarens data tillsammans med det genererade ID:t
      const registeredUser = {
        id: userId,
        username: newUser.username, // Kopiera användarens information (username, email, password)
      };
  
      // Logga hela användarobjektet
      console.log("User registered:", registeredUser);
  
      // Spara användaren i localStorage eller sessionStorage
      // localStorage.setItem('user', JSON.stringify(registeredUser)); // För persistent storage
      sessionStorage.setItem('user', JSON.stringify(registeredUser)); // För session storage
  
      setSuccess(true);
      setError(null);
      setIsLoggedIn(true);
      navigate("/")
  
    } catch (err) {
      setError('Failed to register user. Please try again.');
      setSuccess(false);
    }
  };
  
  return (
    <MyContext.Provider value={{ movies, loading, error, isLoggedIn, success, registerUser }}>
      {children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
