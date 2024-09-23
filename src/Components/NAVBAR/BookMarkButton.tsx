import React from 'react';
import { Link } from 'react-router-dom';

const BookmarkButton = () => {
  return (
    <Link
      to="/favorites" // Länkar till sidan med dina favoritfilmer
      style={{
        textDecoration: 'none',
      }}
      aria-label="Gå till favoritfilmer"
    >
      <button
        style={{
          backgroundColor: '#ff0000', // En röd färg för att efterlikna Netflix-stilen
          border: 'none',
          padding: '10px 20px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '1rem',
          borderRadius: '5px',
        }}
      >
        Favorites
      </button>
    </Link>
  );
};

export default BookmarkButton;
