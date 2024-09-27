//import './Header.css'; // Importera CSS för att hantera animation och styling
import { useEffect } from "react";

function Head() {
  useEffect(() => {
    // Blockera scrollning genom att lägga till en klass på body
    document.body.classList.add("no-scroll");

    // Efter 5 sekunder, ta bort klassen för att tillåta scrollning
    const timer = setTimeout(() => {
      document.body.classList.remove("no-scroll");
      // Lägg till shrink-klassen till headern
      const header = document.getElementById("header");
      if (header) {
        header.classList.add("shrink");
      }
    }, 5000); // 5000 ms = 5 sekunder

    // Rensa timer om komponenten unmountas innan timern går ut
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const headerElement = document.querySelector(".header");
      if (headerElement) {
        headerElement.classList.add("shrink"); // Lägg till klassen 'shrink' efter 5 sekunder
      }
    }, 5000); // 5 sekunder

    // Rensa timern om komponenten tas bort
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="header">
      {/* Logotyp som en bild */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
        alt="Netflix Logo"
        className="netflix-logo"
      />
      {/* Titeltext som kan animeras */}
      <div className="header-title"></div>
    </div>
  );
}

export default Head;
