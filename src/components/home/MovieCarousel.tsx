import { useState } from "react";  // Import useState for managing favorites locally
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Movie } from "../../constants/context";  // Import Movie interface

interface MovieCarouselProps {
  movies: Movie[];
  title: string;
  onBookmark: (movie: Movie) => void;  // onBookmark prop to pass function
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, title, onBookmark }) => {
  // Local state to manage favorites within the component
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Add movie to favorites if it doesn't already exist
  const addFavorite = (movie: Movie) => {
    if (!favorites.find((fav) => fav.title === movie.title)) {
      setFavorites([...favorites, movie]);
      onBookmark(movie);  // Trigger onBookmark when adding a favorite
    }
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
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
