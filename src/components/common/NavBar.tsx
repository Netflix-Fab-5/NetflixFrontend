import { useNavigate } from "react-router-dom";
import Header from "./Header";
import BookmarkButton from "../../components/navbar/BookMarkButton";
import MoviesButton from "../../components/navbar/AllMoviesButton";
import SearchMovie from "../../components/navbar/SearchMovie";
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
      {/* Knappar ovanför Header */}
      <div className="flex flex-col md:flex-row justify-center lg:justify-end items-center p-4">
        {" "}
        {/* Centrera vid sm och md, till höger vid lg och över */}
        <div className="flex space-x-4">
          {" "}
          {/* Skapa utrymme mellan knappar */}
          <BookmarkButton />
          <MoviesButton />
          {/* Logga ut-knappen om användaren är inloggad */}
          {user && (
            <button onClick={handleLogout} className="button">
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Header centrerad */}
      <div className="header-container">
        <Header />
      </div>

      {/* Sökfält under Header */}
      <SearchMovie />
    </>
  );
}

export default NavBar;
