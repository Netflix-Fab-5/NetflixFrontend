import { Link } from "react-router-dom";

const MoviesButton = () => {
  return (
    <Link
      to="/movies" // Länkar till sidan med alla filmer
      style={{
        textDecoration: "none",
      }}
      aria-label="Gå till alla filmer"
    >
      <button
        style={{
          backgroundColor: "#ff0000", // Netflix-stilen
          border: "none",
          padding: "10px 20px",
          color: "white",
          cursor: "pointer",
          fontSize: "1rem",
          borderRadius: "5px",
          marginLeft: "10px",
        }}
      >
        Movies
      </button>
    </Link>
  );
};

export default MoviesButton;
