import { useContext } from "react";
import { MyContext } from "../../constants/context";
import { useNavigate } from "react-router-dom";

function FavoriteScreen() {
  const { favorites, removeFavorite } = useContext(MyContext);
  const navigate = useNavigate();

  // Funktion för att konvertera titeln till en slug
  function createSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/--+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  // Navigera till filmsidan
  function handleThumbnailClick(title: string) {
    const slug = createSlug(title);
    navigate(`/movies/${slug}`);
  }

  // Navigera tillbaka till startsidan
  function handleHomeClick() {
    navigate("/"); // Navigera till startsidan
  }

  return (
    <div className="p-5 relative min-h-screen">
      {/* Home button in the top-right corner */}
      <button className="button float-right" onClick={handleHomeClick}>
        Home
      </button>

      <h1 className="text-2xl font-bold">My favorite movies</h1>

      {/* Kontrollera om det finns några favoriter */}
      {favorites.length === 0 ? (
        <p className="text-white mt-60">You don't have any favorites yet.</p>
      ) : (
        <div className="mt-12 grid grid-cols-auto-fill gap-5">
          {favorites.map((movie) => (
            <div
              key={movie.title}
              className="border border-gray-300 p-4 rounded-lg text-center"
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                onClick={() => handleThumbnailClick(movie.title)}
                className="w-full h-auto rounded-lg mb-2 cursor-pointer" // Gör bilden klickbar
              />
              <h3 className="text-lg font-semibold">{movie.title}</h3>
              <button
                onClick={() => removeFavorite(movie)} // Ta bort från favoriter
                className="border-none bg-transparent p-0 cursor-pointer"
              >
                <i className="fas fa-heart text-red-600 text-2xl transition-colors duration-300 ease-in-out"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteScreen;
