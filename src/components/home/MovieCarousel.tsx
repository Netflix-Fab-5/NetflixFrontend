// MovieCarousel.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Movie } from "../../constants/context"; // Importera Movie-interfacet

interface MovieCarouselProps {
  movies: Movie[]; // Använd Movie från din context-fil
  title: string;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies, title }) => {
  return (
    <div className="carousel-container">
      <h2>{title}</h2>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={5}
        navigation
        pagination={{ clickable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
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
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
