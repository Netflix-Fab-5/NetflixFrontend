import { Link } from "react-router-dom";

const BookmarkButton = () => {
  return (
    <Link
      to="/favorites" // Länkar till sidan med dina favoritfilmer
      style={{
        textDecoration: "none",
      }}
      aria-label="Gå till favoritfilmer"
    >
      <button className="button">
        {" "}
        {/* Använd den gemensamma CSS-klassen */}
        Favorites
      </button>
    </Link>
  );
};

export default BookmarkButton;
