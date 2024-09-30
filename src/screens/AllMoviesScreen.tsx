import React, { useContext } from "react";
import { MyContext } from "../constants/context";
import { Link } from "react-router-dom";
import styled from "styled-components";

// Funktion för att konvertera titeln till en URL-vänlig slug
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

const Container = styled.div`
  padding: 20px;
  position: relative;
`;

const HomeButton = styled(Link)`
  position: absolute;
  top: 20px;
  right: 20px;
  text-decoration: none;

  @media (max-width: 768px) {
    position: static;
    display: block;
    margin-bottom: 20px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const MovieGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const MovieCard = styled.div`
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
`;

const MovieImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const AllMoviesScreen: React.FC = () => {
  const { movies, loading, error } = useContext(MyContext);

  return (
    <Container>
      <HomeButton to="/">
        <Button>Home</Button>
      </HomeButton>

      <h1>Alla Filmer</h1>

      {loading && <p>Laddar...</p>}
      {error && <p>Error: {error}</p>}

      <MovieGrid>
        {Object.values(movies).map((movie) => (
          <MovieCard key={movie.title}>
            <Link to={`/movies/${createSlug(movie.title)}`}>
              <MovieImage src={movie.thumbnail} alt={movie.title} />
              <h3>{movie.title}</h3>
            </Link>
          </MovieCard>
        ))}
      </MovieGrid>
    </Container>
  );
};

export default AllMoviesScreen;