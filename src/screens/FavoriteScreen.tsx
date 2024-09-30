import { useContext } from "react";
import { MyContext } from "../constants/context";
import { useNavigate } from "react-router-dom";

const FavoriteScreen = () => {
  const { favorites, removeFavorite } = useContext(MyContext);
  const navigate = useNavigate();

  // Funktion för att konvertera titeln till en slug
  const createSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };

  // Navigera till filmsidan
  const handleThumbnailClick = (title: string) => {
    const slug = createSlug(title);
    navigate(`/movies/${slug}`);
  };

  // Navigera tillbaka till startsidan
  const handleHomeClick = () => {
    navigate("/"); // Navigera till startsidan
  };

  return (
    <div style={{ padding: "20px", position: "relative", minHeight: "100vh" }}>
      {/* Home button in the top-right corner */}
      <button
        onClick={handleHomeClick}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#4CAF50", // Grön bakgrund
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          zIndex: 1000, // Ensure it stays above other content
        }}
      >
        Home
      </button>

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
                  cursor: "pointer", // Gör bilden klickbar
                }}
              />
              <h3>{movie.title}</h3>
              <button
                onClick={() => removeFavorite(movie)} // Ta bort från favoriter
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
                    color: "red",
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
