// DeleteButton.tsx
import React, { useContext } from "react";
import { MyContext } from "../../constants/context";
import { useNavigate } from "react-router-dom";

interface DeleteButtonProps {
  setDisplayMessage: React.Dispatch<React.SetStateAction<string | null>>;
  movieId: string | undefined;
  className?: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({
  setDisplayMessage,
  movieId,
}) => {
  const { deleteMovie } = useContext(MyContext);
  const navigate = useNavigate();
  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (!movieId) return; // First check if id is not undefined then delete the movie

    await deleteMovie(movieId);
    setDisplayMessage("Movie deleted successfully");
    setDisplayMessage("Delete action cancelled");
    navigate("/movies");
  }

  return (
    <button
      onClick={handleDelete}
      className="max-650:w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
    >
      Delete
    </button>
  );
};

export default DeleteButton;
