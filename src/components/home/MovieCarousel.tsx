import { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { MyContext } from "../../constants/context";
import { Movie } from "../../constants/types";
import { getRatingDescription } from "../../constants/ratingUtils";
import EditButton from "../admin/EditButton";
import { fetchMovieByTitle } from "../../firebase/firebaseApi";

const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

interface MovieCarouselProps {
  movies: Movie[];
  title?: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, title }) => {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, favorites } = useContext(MyContext);
  const navigate = useNavigate();

  const handleThumbnailClick = (title: string) => {
    const slug = createSlug(title);
    navigate(`/movies/${slug}`);
  };

  return (
    <div className="carousel-container">
      <h2>{title}</h2>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={5}
        navigation
        pagination={{ clickable: true }}
      >
        {movies.map((movie) => {
          const isFavorite = favorites.some((fav) => fav.title === movie.title);

          const handleFavoriteToggle = (event: React.MouseEvent) => {
            event.stopPropagation(); // Stoppa händelse från att bubbla upp
            if (isFavorite) {
              removeFavorite(movie);
            } else {
              addFavorite(movie);
            }
          };

          const handleEdit = async (title: string) => {
            const movie = await fetchMovieByTitle(title);
            if (movie) {
              const movieWithId = movie as Movie & { id: string };
              const movieId = movieWithId.id;
              console.log("edit button", movieId);
              navigate(`/movies/edit/${movieId}`);
            } else {
              console.log("Movie not found");
            }
          };

          return (
            <SwiperSlide key={movie.title}>
              <div
                className="carousel-item cursor-pointer"
                onClick={() => handleThumbnailClick(movie.title)}
              >
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="carousel-image"
                />
                <div className="button-container">
                  {user && user.email === "admin@mail.com" && (
                    <EditButton
                      onClick={(event) => {
                        event.stopPropagation(); // Stoppa händelse från att bubbla upp
                        handleEdit(movie.title);
                      }}
                      size={22}
                    />
                  )}
                  <div className="heart-icon-container cursor-pointer">
                    <i
                      title="favorite"
                      className="fas fa-heart"
                      style={{
                        fontSize: "24px",
                        color: isFavorite ? "red" : "lightgrey",
                        transition: "color 0.3s ease",
                      }}
                      onClick={handleFavoriteToggle} // Lägger till klickhändelse för hjärtat
                    ></i>
                  </div>
                </div>
                <h3>{movie.title}</h3>
                <p>{getRatingDescription(movie.rating, true)}</p>
                <p>{movie.year}</p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
