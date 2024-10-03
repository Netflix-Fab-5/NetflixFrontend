import { useEffect, useState } from "react";

export const useHeaderEffect = (): {
  isExpanded: boolean;
  noAnimation: boolean;
} => {
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const hasRunEffect = localStorage.getItem("netflixEffectRun");
    return !hasRunEffect; // Om flaggan inte finns, börja i expanderat läge
  });

  const [noAnimation, setNoAnimation] = useState<boolean>(() => {
    return localStorage.getItem("netflixEffectRun") !== null;
  });

  useEffect(() => {
    const hasRunEffect = localStorage.getItem("netflixEffectRun");

    if (!hasRunEffect) {
      // Blockera scrollning genom att lägga till en klass på body
      document.body.classList.add("no-scroll");

      // Efter 5 sekunder, ta bort klassen för att tillåta scrollning och lägg till shrink
      const timer = setTimeout(() => {
        document.body.classList.remove("no-scroll");

        // Efter timeout, förminska headern
        setIsExpanded(false);

        // Låt animationen slutföras (1 sekund) innan vi inaktiverar animationer
        setTimeout(() => {
          // Spara i LocalStorage att effekten har körts
          localStorage.setItem("netflixEffectRun", "true");

          // Ställ in noAnimation för framtida sidvisningar
          setNoAnimation(true);
        }, 1000); // Motsvarar transition-tiden (1s i CSS)
      }, 5000); // 5000 ms = 5 sekunder

      // Rensa timer om komponenten unmountas innan timern går ut
      return () => clearTimeout(timer);
    }
  }, []);

  return { isExpanded, noAnimation };
};
