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

          const handleFavoriteToggle = () => {
            if (isFavorite) {
              removeFavorite(movie);
            } else {
              addFavorite(movie);
            }
          };

          const handleEdit = (title: string) => {
            //  const slug = createSlug(title);
            //  navigate(`/movies/edit/${slug}`);
            console.log(title);
          };

          return (
            <SwiperSlide key={movie.title}>
              <div className="carousel-item">
                <div className="flex flex-col">
                  {user && user.email === "admin@mail.com" && (
                    <EditButton
                      onClick={() => handleEdit(movie.title)}
                      size={22} // Du kan justera storleken om det behövs
                    />
                  )}
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="carousel-image"
                    onClick={() => handleThumbnailClick(movie.title)}
                  />
                </div>
                <h3>{movie.title}</h3>
                <p>{getRatingDescription(movie.rating, true)}</p>
                <p>{movie.year}</p>
                <button
                  onClick={(event) => {
                    event.stopPropagation(); // Förhindra att klicket bubbla upp till carousel-item
                    handleFavoriteToggle(); // Anropa funktionen för att lägga till eller ta bort favorit
                  }}
                  style={{
                    border: "none",
                    background: "none",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  <div className="heart-icon-container">
                    <i
                      title="favorite"
                      className="fas fa-heart"
                      style={{
                        fontSize: "24px",
                        color: isFavorite ? "red" : "lightgrey",
                        transition: "color 0.3s ease",
                      }}
                    ></i>
                  </div>
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
