import { useContext } from "react";
import { MyContext } from "../constants/context";
import { Link } from "react-router-dom";
import GenreFilter from "../components/home/GenreFilter";
import { getRatingDescription } from "../constants/ratingUtils";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
//import { useNavigate } from "react-router-dom";
import { getRatingDescription } from "../constants/ratingUtils";

// Function to convert title to a URL-friendly slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

const AllMoviesScreen: React.FC = () => {
  const { user, loading } = useAuth();
  // Use context to access data
  const { filteredMovies, error, addFavorite, removeFavorite, favorites } =
    useContext(MyContext);

  if (loading) {
    return <div>Laddar...</div>;
  }

  const handleEdit = (title: string) => {
    //  const slug = createSlug(title);
    //  navigate(`/movies/edit/${slug}`);
    console.log(title);
  };
  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {/* Home button at the top-right corner */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Home
          </button>
        </Link>
      </div>

      {/* Favorites button at the top-right corner */}
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <Link to="/favorites" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "red", // Change color as needed
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Favorites
          </button>
        </Link>
      </div>

      <h1 style={{ marginBottom: "20px" }}>Alla Filmer</h1>

      <div className="mb-4">
        <GenreFilter />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredMovies.map((movie, index) => {
          // Check if the movie is a favorite
          const isFavorite = favorites.some((fav) => fav.title === movie.title);

          // Function to toggle favorite status
          const handleFavoriteToggle = () => {
            if (isFavorite) {
              removeFavorite(movie);
            } else {
              addFavorite(movie);
            }
          };

          return (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                padding: "15px",
                background: "#fff",
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)")
              }
            >
              {user && user.email === "admin@mail.com" && (
                <FaEdit
                  size={32}
                  className="absolute p-1 top-15 text-green-70"
                  onClick={() => handleEdit(movie.title)}
                />
              )}

              {/* Navigate to the movie page with a slugified title */}
              <Link to={`/movies/${createSlug(movie.title)}`}>
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
                <h3
                  className="text-lg font-bold"
                  style={{ margin: "10px 0", fontSize: "1.1em" }}
                >
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-500" style={{ margin: "0" }}>
                  {movie.genre}
                </p>
                <p className="text-sm text-gray-700">
                  {getRatingDescription(movie.rating, true)}
                </p>
              </Link>
              {/* Favorite button placed at the bottom center */}
              <div style={{ marginTop: "auto", padding: "10px 0" }}>
                <button
                  onClick={handleFavoriteToggle}
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
                      color: isFavorite ? "red" : "lightgrey", // Red if favorite, light grey if not
                      transition: "color 0.3s ease",
                    }}
                  ></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default AllMoviesScreen;
