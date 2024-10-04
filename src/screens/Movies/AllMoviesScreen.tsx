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

  useEffect(() => {
    handleFetchMovies();
  }, [handleFetchMovies]);

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
    <div className="w-full min-h-screen p-4">
      <div className="flex justify-between items-center mb-4 w-full lg:justify-end sm:justify-center">
        <div className="flex space-x-4">
          <Link to="/" className="button">
            <button className="button">Home</button>
          </Link>
          <Link to="/favorites" className="button">
            <button className="button">Favorites</button>
          </Link>
          {user && user.email === "admin@mail.com" && (
            <Link to="/movies/add-new-movie" className="button">
              <button className="button">Add A New Movie</button>
            </Link>
          )}
        </div>
      </div>

      <h1 className="text-2xl font-bold text-center mt-4">All Movies</h1>

      <div className="my-4">
        <GenreFilter />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6 gap-4">
        {filteredMovies.map((movie, index) => {
          const isFavorite = favorites.some((fav) => fav.title === movie.title);

          return (
            <div
              key={index}
              className="movie-card border rounded-lg p-4 shadow-md relative flex flex-col items-center justify-between border-green-300"
            >
              {user && user.email === "admin@mail.com" && (
                <EditButton
                  onClick={() => handleEdit(movie.title)}
                  size={22}
                  className="absolute top-2 right-2"
                />
              )}
              <Link to={`/movies/${createSlug(movie.title)}`}>
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-full h-auto rounded-lg mb-2"
                />
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
                  className={` fas fa-heart ${isFavorite ? "text-red-500" : "text-lightgray'"}  `}
                  style={{ fontSize: "24px", transition: "color 0.3s ease" }}
                  onClick={() => handleFavoriteToggle(movie, isFavorite)}
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
