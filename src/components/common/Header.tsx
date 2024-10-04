import { useHeaderEffect } from "../../hooks/useHeaderAnimation";
import { useEffect, useState } from "react";

function Head() {
  const { isExpanded, noAnimation } = useHeaderEffect();
  const [noScroll, setNoScroll] = useState(true); // State för att styra scroll

  useEffect(function () {
    // Kontrollera om 'netflixEffectRun' finns i localStorage
    const effectRun = localStorage.getItem("netflixEffectRun");

    // Om det inte finns eller är false, sätt no-scroll under de första 5 sekunderna
    if (effectRun !== "true") {
      setNoScroll(true);

      // Starta timer för att ta bort no-scroll efter 5 sekunder
      const timer = setTimeout(function () {
        setNoScroll(false);

        // Uppdatera localStorage för att indikera att effekten har körts
        localStorage.setItem("netflixEffectRun", "true");
      }, 5000);

      // Rensa timer när komponenten avmonteras
      return function () {
        clearTimeout(timer);
      };
    } else {
      // Om netflixEffectRun redan är true, se till att no-scroll inte är aktiv
      setNoScroll(false);
    }
  }, []);

  useEffect(() => {
    // Lägg till eller ta bort no-scroll-klassen baserat på noScroll-state
    if (noScroll) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [noScroll]);

  return (
    <div
      className={`flex flex-col justify-center items-center bg-black p-[100px] text-center transition-height duration-1000 ease-in-out ${
        isExpanded ? "h-[100vh]" : "h-[10vh]"
      } ${noAnimation ? "transition-none" : ""}`}
      id="header"
    >
      {/* Logotyp som en bild */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
        alt="Netflix Logo"
        className={`w-[240px] h-auto mb-5 transition-transform duration-1000 ease-in-out ${
          isExpanded ? "scale-100" : "scale-80"
        } filter hue-rotate-[90deg] saturate-[500%] animate-fadeInLogo`}
      />
    </div>
  );
}

export default Head;
