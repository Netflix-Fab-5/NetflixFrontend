import { useContext } from "react";
import { MyContext } from "../../constants/Context";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Trending = () => {
  const { movies } = useContext(MyContext); // Hämtar filmer från Context

  // Kontrollera att filmer finns innan vi filtrerar
  const trendingMovies = movies?.filter((movie) => movie.isTrending) || [];

  return (
    <div className="carousel-container">
      <h2>Trending Movies</h2>
      <Swiper
        // Install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={5}
        navigation
        pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        {trendingMovies.map((movie, index) => (
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

export default Trending;
