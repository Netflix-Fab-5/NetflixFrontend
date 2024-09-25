import React from "react";
import { useParams } from "react-router-dom"; // För att hämta ID från URL

const MovieDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Hämta filmens ID från URL:en

  return (
    <div>
      <h1>Hej från MovieDetailScreen!</h1>
      <p>Film-ID: {id}</p>
    </div>
  );
};

export default MovieDetailScreen;
