import { useContext } from "react";
import { MyContext } from "../constants/context";
import { Link } from "react-router-dom";
import GenreFilter from "../components/home/GenreFilter";

// Funktion för att konvertera titeln till en URL-vänlig slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

const AllMoviesScreen: React.FC = () => {
  // Använd context för att få tillgång till data
  const { filteredMovies, loading, error } = useContext(MyContext);

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

      <h1>Alla Filmer</h1>

      {loading && <p>Laddar...</p>}
      {error && <p>Error: {error}</p>}

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
        {filteredMovies.map((movie, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            {/* Använd Link för att navigera till filmsidan med slugifierad titel */}
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
              <h3 className="text-lg font-bold">{movie.title}</h3>
              <p className="text-sm text-gray-500">{movie.genre}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMoviesScreen;
