import { useContext } from "react";
import { MyContext } from "../../constants/context";
import MovieCarousel from "./MovieCarousel";

const Trending = () => {
  const { movies } = useContext(MyContext);

  // Filtrera de trenderande filmerna
  const trendingMovies = Object.values(movies || {}).filter(
    (movie) => movie.isTrending,
  );

  return (
    <div style={{ marginBottom: "2rem" }}>
      {" "}
      {/* Marginal under sektionen */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
          paddingLeft: "190px",
        }}
      >
        {" "}
        {/* Flex container för titel och ikon */}
        <i
          className="fas fa-arrow-up"
          style={{
            color: "#01d613", // Ikonfärg
            fontSize: "24px", // Ikonstorlek
          }}
        ></i>
        <h2
          style={{
            fontSize: "24px", // Titeln storlek
            fontWeight: "bold", // Fet stil
            marginLeft: "10px", // Flyttar titeln 50px till höger
          }}
        >
          Trending Movies
        </h2>
      </div>
      <MovieCarousel movies={trendingMovies} title={"Trending movies"} />
    </div>
  );
};

export default Trending;
