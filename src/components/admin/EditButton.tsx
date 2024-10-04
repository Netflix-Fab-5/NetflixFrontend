import { FaEdit } from "react-icons/fa";

// Typdefinitioner, om du vill ha props
interface EditButtonProps {
  onClick: (event: React.MouseEvent) => void; // Funktion att anropa vid klick
  size?: number; // Storleken på ikonen, kan vara valfri
  className?: string;
}

function EditButton({ onClick, size = 22 }: EditButtonProps) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-white shadow-lg cursor-pointer"
      style={{
        width: size + 6,
        height: size + 6,
        position: "relative",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        transition: "transform 0.2s ease, background-color 0.3s ease",
        zIndex: 10,
      }}
      data-testid="edit-button"
      onClick={onClick} // Anropa den medskickade onClick-funktionen
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)"; // Förstora knappen
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)"; // Ändra transparens vid hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)"; // Återställ storlek
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; // Återställ bakgrund
      }}
    >
      <FaEdit size={size} className="text-green-800 p-1" />
    </div>
  );
}

export default EditButton;
