import { useContext } from "react";
import { MyContext } from "../constants/context";
import { Link } from "react-router-dom";

// Wrap each movie item with a Link component
const AllMoviesScreen: React.FC = () => {
  // Använd context för att få tillgång till data
  const { movies, loading, error } = useContext(MyContext);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Alla Filmer</h1>

      {loading && <p>Laddar...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && Object.keys(movies).length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {Object.entries(movies).map(([id, movie]) => (
            <div
              key={id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              {/* Använd Link för att navigera till filmsidan */}
              <Link to={`/movies/${id}`}>
                {" "}
                {/* Använd 'id' här */}
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
      ) : (
        !loading && <p>Inga filmer tillgängliga.</p>
      )}
    </div>
  );
};

export default AllMoviesScreen;
