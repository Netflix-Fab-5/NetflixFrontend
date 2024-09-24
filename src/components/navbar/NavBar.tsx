import { Link } from "react-router-dom";
import Header from "./Header";
import BookmarkButton from "./BookMarkButton";
import MoviesButton from "./AllMoviesButton";

function NavBar() {
  return (
    <>
      <div>
        <Header title={"NETFLIX"} />
        <form>
          <button type="submit">
            {/* Kan läggas till något för submit om det behövs */}
          </button>
          <input type="text" placeholder="Search Movie Name from here" />
        </form>
        <BookmarkButton />
        <MoviesButton />

        {/* Lägg till en login-knapp här */}
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>

      <div>{/* Eventuella andra element */}</div>
    </>
  );
}

export default NavBar;
