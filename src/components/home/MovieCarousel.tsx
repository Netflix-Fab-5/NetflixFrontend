import { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { useNavigate } from "react-router-dom"; // Importera useNavigate
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { MyContext } from "../../constants/context"; // Import Movie interface and context
import { Movie } from "../../constants/types";

// Funktion för att omvandla titeln till en URL-vänlig sträng (slug)
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
  const { addFavorite, removeFavorite } = useContext(MyContext);
  const navigate = useNavigate();

  // Funktion för att hantera thumbnail-klick och navigera till film baserat på titel
  const handleThumbnailClick = (title: string) => {
    const slug = createSlug(title); // Konvertera titeln till en slug
    navigate(`/movies/${slug}`); // Navigera till /movies/slug
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
        {movies.map((movie) => (
          <SwiperSlide key={movie.title}>
            <div className="carousel-item">
              {/* När du klickar på bilden, navigera till filmsidan med movie.title */}
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="carousel-image"
                onClick={() => handleThumbnailClick(movie.title)} // Använd titeln för att navigera
              />
              <h3>{movie.title}</h3>
              <p>{movie.genre}</p>
              <p>{movie.year}</p>
              <button onClick={() => addFavorite(movie)}>Favorite</button>
              <button onClick={() => removeFavorite(movie)}>
                Remove Favorite
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
