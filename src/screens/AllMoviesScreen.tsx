import { useContext } from "react";
import { MyContext } from "../constants/context";
import { Link } from "react-router-dom";

// Funktion för att konvertera titeln till en URL-vänlig slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

const AllMoviesScreen: React.FC = () => {
  // Använd context för att få tillgång till data
  const { movies, loading, error } = useContext(MyContext);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Alla Filmer</h1>

      {loading && <p>Laddar...</p>}
      {error && <p>Error: {error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {Object.values(movies).map((movie) => (
          <div
            key={movie.title} // Använd title som unikt nyckelvärde
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
              <h3>{movie.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMoviesScreen;
