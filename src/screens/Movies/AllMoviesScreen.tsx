import React, { useContext, useEffect } from "react";
import { MyContext } from "../../constants/context";
import { Link, useNavigate } from "react-router-dom";
import GenreFilter from "../../components/home/GenreFilter";
import { getRatingDescription } from "../../constants/ratingUtils";
import EditButton from "../../components/admin/EditButton";
import { useAuth } from "../../hooks/useAuth";
import { fetchMovieByTitle } from "../../firebase/firebaseApi";
import { Movie } from "../../constants/types";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/--+/g, "-")
    .replace(/[^\w-]+/g, "");
}

function AllMoviesScreen() {
  const { user, loading } = useAuth();
  const {
    filteredMovies,
    error,
    addFavorite,
    removeFavorite,
    handleFetchMovies,
    favorites,
  } = useContext(MyContext);
  const navigate = useNavigate();

  useEffect(
    function () {
      handleFetchMovies();
    },
    [handleFetchMovies],
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  async function handleEdit(title: string) {
    const movie = await fetchMovieByTitle(title);
    if (movie) {
      const movieWithId = movie as Movie & { id: string };
      const movieId = movieWithId.id;
      navigate(`/movies/edit/${movieId}`);
    } else {
      console.log("Movie not found");
    }
  }

  function handleFavoriteToggle(movie: Movie, isFavorite: boolean) {
    if (isFavorite) {
      removeFavorite(movie);
    } else {
      addFavorite(movie);
    }
  }

  return (
    <div className="container">
      <div className="top-right">
        <Link to="/" className="button">
          <button className="button">Home</button>
        </Link>
        {user && user.email === "admin@mail.com" && (
          <Link to="/movies/add-new-movie" className="button">
            <button className="button">Add A New Movie</button>
          </Link>
        )}
      </div>

      <div className="top-left">
        <Link to="/favorites" className="button">
          <button className="button">Favorites</button>
        </Link>
      </div>

      <h1 className="heading max-650:mt-16 sm:mt-16 lg:mt-16 md:mt-16">
        All movies
      </h1>

      <div className="mb-4">
        <GenreFilter />
      </div>

      <div className="movie-grid">
        {filteredMovies.map(function (movie, index) {
          const isFavorite = favorites.some(function (fav) {
            return fav.title === movie.title;
          });

          return (
            <div key={index} className="movie-card">
              {user && user.email === "admin@mail.com" && (
                <EditButton
                  onClick={function () {
                    handleEdit(movie.title);
                  }}
                  size={22}
                />
              )}
              <Link to={`/movies/${createSlug(movie.title)}`}>
                <img src={movie.thumbnail} alt={movie.title} />
                <h3 className="movie-title text-lg font-bold">{movie.title}</h3>
                <p className="movie-genre text-sm text-gray-500">
                  {movie.genre}
                </p>
                <p className="movie-rating text-sm text-gray-700">
                  {getRatingDescription(movie.rating, true)}
                </p>
              </Link>
              <div className="heart-icon-container2 cursor-pointer">
                <i
                  title="favorite"
                  className="fas fa-heart"
                  style={{
                    fontSize: "24px",
                    color: isFavorite ? "red" : "lightgrey",
                    transition: "color 0.3s ease",
                  }}
                  onClick={function () {
                    handleFavoriteToggle(movie, isFavorite);
                  }}
                ></i>
              </div>
            </div>
          );
        })}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default AllMoviesScreen;
