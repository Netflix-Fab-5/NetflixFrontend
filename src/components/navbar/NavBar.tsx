import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import BookmarkButton from "./BookMarkButton";
import MoviesButton from "./AllMoviesButton";
import SearchMovie from "./SearchMovie";
import { logoutUser } from "../../firebase/firebaseAuth"; // Importera logoutUser-funktionen
import { useAuth } from "../../hooks/useAuth";

function NavBar() {
  const { user } = useAuth(); // Hämta användarinformation för att visa logga ut-knappen endast om användaren är inloggad
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logoutUser(); // Logga ut från Firebase
      sessionStorage.clear(); // Rensa sessionStorage
      navigate("/login"); // Omdirigera till inloggningssidan efter utloggning
    } catch (error) {
      console.error("Fel vid utloggning:", error);
    }
  };

  return (
    <>
      <div>
        <Header />

        <BookmarkButton />
        <MoviesButton />
        <SearchMovie />
        {!user && (
          <Link to="/register">
            <button>Register</button>
          </Link>
        )}

        {/* Visa logga ut-knappen om användaren är inloggad */}
        {user && <button onClick={handleLogout}>Logga ut</button>}
      </div>

      <div>{/* Eventuella andra element */}</div>
    </>
  );
}

export default NavBar;
