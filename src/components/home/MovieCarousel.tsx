import { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { MyContext } from "../../constants/context";
import { Movie } from "../../constants/types";
import { getRatingDescription } from "../../constants/ratingUtils";

const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

interface MovieCarouselProps {
  movies: Movie[];
  title: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, title }) => {
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
          // Kontrollera om filmen är i favoriter
          const isFavorite = favorites.some((fav) => fav.title === movie.title);

          const handleFavoriteToggle = () => {
            if (isFavorite) {
              removeFavorite(movie);
            } else {
              addFavorite(movie);
            }
          };

          return (
            <SwiperSlide key={movie.title}>
              <div className="carousel-item">
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="carousel-image"
                  onClick={() => handleThumbnailClick(movie.title)}
                />
                <h3>{movie.title}</h3>
                <p>{getRatingDescription(movie.rating, true)}</p>
                <p>{movie.year}</p>
                <button
                  onClick={handleFavoriteToggle}
                  style={{
                    border: "none",
                    background: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <i
                    title="favorite"
                    className="fas fa-heart"
                    style={{
                      fontSize: "24px",
                      color: isFavorite ? "red" : "lightgrey", // Genomskinligt röd om inte favoriterad
                      transition: "color 0.3s ease",
                    }}
                  ></i>
                </button>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
