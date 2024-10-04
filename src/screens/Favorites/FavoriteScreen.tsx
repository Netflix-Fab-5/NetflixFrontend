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
    <div className="w-full min-h-screen p-4">
      {/* Home button in the top-right corner */}
      <div className="flex justify-between items-center mb-4 w-full lg:justify-end sm:justify-center max-650:justify-center">
        <button
          className="button bg-transparent border-none text-lg cursor-pointer hover:text-gray-400"
          onClick={handleHomeClick}
        >
          Home
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center mt-4 text-white">
        My favorite movies
      </h1>

      {/* Kontrollera om det finns några favoriter */}
      {favorites.length === 0 ? (
        <p className="text-white mt-60 text-center">
          You don't have any favorites yet.
        </p>
      ) : (
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6 gap-4">
          {favorites.map((movie, index) => (
            <div
              key={index}
              className="movie-card border border-green-300 rounded-lg p-4 shadow-md relative flex flex-col items-center justify-between"
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                onClick={() => handleThumbnailClick(movie.title)}
                className="w-full h-auto rounded-lg mb-2 cursor-pointer"
              />
              <h3 className="movie-title text-lg font-bold text-white">
                {movie.title}
              </h3>
              <button
                onClick={() => removeFavorite(movie)} // Ta bort från favoriter
                className="bg-transparent border-none p-0 cursor-pointer"
              >
                <i className="fas fa-heart text-2xl text-red-500 transition-colors duration-300"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoriteScreen;
