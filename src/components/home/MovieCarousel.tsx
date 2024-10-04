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
    .replace(/--+/g, "-")
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
    // Här lägger vi till en maxbredd på 80% och skalar ner karusellen på mindre skärmar
    <div className="relative w-full mx-auto sm:w-4/5 overflow-hidden transform sm:scale-100 scale-90">
      <h2 className="hidden">{title}</h2> {/* Döljer titeln som inte visas */}
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 }, // Visa 1 slide
          768: { slidesPerView: 3 }, // Visa 3 slides
          1024: { slidesPerView: 4 }, // Visa 4 slides
          1280: { slidesPerView: 5 }, // Visa 5 slides
        }}
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
                className="relative cursor-pointer min-w-[150px] m-1 flex flex-col items-center justify-center border-none p-0 rounded-lg shadow-lg h-[400px] sm:h-[450px] group" // Carousel item styling + group for hover
                onClick={() => handleThumbnailClick(movie.title)}
              >
                <div className="relative w-full h-full aspect-[16/9]">
                  {" "}
                  {/* Skapar ett 16:9 förhållande */}
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-full h-full aspect-[16/9] rounded-lg border-2 border-green-300 opacity-100 transition-all duration-300 ease-in-out group-hover:opacity-20" // Carousel image styling
                  />
                </div>
                <div className="absolute top-2 left-2 right-2 z-10 flex justify-between">
                  {" "}
                  {/* Knappar över bilden */}
                  {user && user.email === "admin@mail.com" && (
                    <EditButton
                      onClick={(event) => {
                        event.stopPropagation(); // Stoppa händelse från att bubbla upp
                        handleEdit(movie.title);
                      }}
                      size={22}
                    />
                  )}
                  <div className="cursor-pointer">
                    <i
                      title="favorite"
                      className={`fas fa-heart text-2xl transition-colors duration-300 ease-in-out ${isFavorite ? "text-red-500" : "text-lightgray"}`}
                      onClick={handleFavoriteToggle} // Lägger till klickhändelse för hjärtat
                    ></i>
                  </div>
                </div>
                {/* Hover text on image */}
                <h3 className="absolute left-4 right-4 top-1/3 text-white font-bold text-xl text-center opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                  {" "}
                  {/* Titel med hover-effekt på hela bilden */}
                  {movie.title}
                </h3>
                <p className="absolute left-4 right-4 top-1/2 text-white text-xl opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                  {" "}
                  {/* Rating med hover-effekt på hela bilden */}
                  {getRatingDescription(movie.rating, true)}
                </p>
                <p className="absolute left-4 right-4 top-3/4 text-white text-xl opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                  {" "}
                  {/* År med hover-effekt på hela bilden */}
                  {movie.year}
                </p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
