import { useContext } from "react"; // Import useContext
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Movie, MyContext } from "../../constants/context"; // Import Movie interface and context

interface MovieCarouselProps {
  movies: Movie[];
  title: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, title }) => {
  // Get context values
  const { addFavorite, removeFavorite } = useContext(MyContext); // Destructure addFavorite from context

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
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            <div className="carousel-item">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="carousel-image"
              />
              <h3>{movie.title}</h3>
              <p>{movie.genre}</p>
              <p>{movie.year}</p>
              {/* Add the Bookmark Button here */}
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
