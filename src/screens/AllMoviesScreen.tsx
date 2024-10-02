import { useContext, useEffect } from "react";
import { MyContext } from "../constants/context";
import { Link, useNavigate } from "react-router-dom";
import GenreFilter from "../components/home/GenreFilter";
import { getRatingDescription } from "../constants/ratingUtils";
import EditButton from "../components/admin/EditButton";
import { useAuth } from "../hooks/useAuth";
import { fetchMovieByTitle } from "../firebase/firebaseApi";
import { Movie } from "../constants/types";
import "../styles/allmoviesscreen.css";

// Function to convert title to a URL-friendly slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/--+/g, "-") // Replace multiple hyphens with one
    .replace(/[^\w-]+/g, "");
};

const AllMoviesScreen: React.FC = () => {
  const { user, loading } = useAuth();
  const {
    filteredMovies,
    error,
    addFavorite,
    removeFavorite,
    handleFetchMovies,
    favorites,
    isMobile,
    //setIsMobile,
  } = useContext(MyContext);
  const navigate = useNavigate();
  
  // const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    handleFetchMovies(); // Fetch movies on page load
    // Detect screen size
    // const handleResize = () => setIsMobile(window.innerWidth <= 768);
    // window.addEventListener("resize", handleResize);
    // handleResize(); // Run on initial render
    // return () => window.removeEventListener("resize", handleResize);
  }, [handleFetchMovies]);

  const handleEdit = async (title: string) => {
    const movie = await fetchMovieByTitle(title);
    if (movie) {
      const movieWithId = movie as Movie & { id: string };
      const movieId = movieWithId.id;
      navigate(`/movies/edit/${movieId}`);
    } else {
      console.log("Movie not found");
    }
  };

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {/* Button Layout for Larger Screens */}
      {!isMobile && (
        <>
          <div style={{ position: "absolute", top: "20px", left: "20px" }}>
            <Link to="/favorites" style={{ textDecoration: "none" }}>
              <button className="button">Favorites</button>
            </Link>
          </div>

          <div style={{ position: "absolute", top: "20px", right: "20px" }}>
            <Link to="/" style={{ textDecoration: "none" }}>
              <button className="button">Home</button>
            </Link>
            {user && user.email === "admin@mail.com" && (
              <Link to="/movies/add-new-movie" style={{ textDecoration: "none" }}>
                <button className="button" style={{ marginLeft: "10px" }}>
                  Add A New Movie
                </button>
              </Link>
            )}
          </div>
        </>
      )}

      {/* Tab Navigation for Mobile Devices */}
      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            width: "100%",
            backgroundColor: "black",
            boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.2)",
            display: "flex",
            justifyContent: "space-around",
            padding: "10px 0",
            zIndex: 1000,
          }}
        >
          <Link to="/favorites" style={{ textDecoration: "none" }}>
            <button className="button">Favorites</button>
          </Link>
          <Link to="/" style={{ textDecoration: "none" }}>
            <button className="button">Home</button>
          </Link>
          {user && user.email === "admin@mail.com" && (
            <Link to="/movies/add-new-movie" style={{ textDecoration: "none" }}>
              <button className="button">Add</button>
            </Link>
          )}
        </div>
      )}

      <h1 style={{ marginBottom: "20px" }}>All Movies</h1>

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
          const isFavorite = favorites.some((fav) => fav.title === movie.title);
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
                <EditButton
                  onClick={() => handleEdit(movie.title)}
                  size={22} // Adjust the size if necessary
                />
              )}

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
                      color: isFavorite ? "red" : "lightgrey",
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