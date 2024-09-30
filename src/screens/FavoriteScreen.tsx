import { useContext } from "react";
import { MyContext } from "../constants/context";
import { useNavigate } from "react-router-dom";

const FavoriteScreen = () => {
  const { favorites, removeFavorite } = useContext(MyContext);
  const navigate = useNavigate();

  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  const handleThumbnailClick = (title: string) => {
    const slug = createSlug(title); // Konvertera titeln till en slug
    navigate(`/movies/${slug}`); // Navigera till /movies/slug
  };

  return (
    <div>
      <h1>Mina Favoritfilmer</h1>

      {/* Kontrollera om det finns några favoriter */}
      {favorites.length === 0 ? (
        <p>Du har inga favoritfilmer ännu.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {favorites.map((movie) => (
            <div
              key={movie.title}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <img
                src={movie.thumbnail}
                alt={movie.title}
                onClick={() => handleThumbnailClick(movie.title)}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
              <h3>{movie.title}</h3>
              <button
                onClick={() => removeFavorite(movie)} // Ta bort filmen från favoriter
                style={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <i
                  className="fas fa-heart"
                  style={{
                    fontSize: "24px",
                    color: "red", // Röd om filmen är i favoriter
                    transition: "color 0.3s ease",
                  }}
                ></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteScreen;
