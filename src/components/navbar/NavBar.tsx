import { Link } from "react-router-dom";
import Header from "./Header";
import BookmarkButton from "./BookMarkButton";
import MoviesButton from "./AllMoviesButton";
import SearchMovie from "./SearchMovie";

function NavBar() {
  return (
    <>
      <div>
        <Header title={"NETFLIX"} />

        <BookmarkButton />
        <MoviesButton />
        <SearchMovie />
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
