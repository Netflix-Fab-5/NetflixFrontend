import { useHeaderEffect } from "../../hooks/useHeaderAnimation";

function Head() {
  const { isExpanded, noAnimation } = useHeaderEffect();

  return (
    <div
      className={`header ${isExpanded ? "expand" : "shrink"} ${noAnimation ? "no-animation" : ""}`}
      id="header"
    >
      {/* Logotyp som en bild */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
        alt="Netflix Logo"
        className="netflix-logo"
      />
    </div>
  );
}

export default Head;
