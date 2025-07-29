import { ArrowUp } from "lucide-react";

const GoToTop = () => {
  const gotop = () => {
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <button
        className="bg-foreground text-background"
        style={{
          position: "fixed",
          bottom: "3rem", // Adjust this value as needed to position above the footer
          right: "3rem", // Adjust this value as needed
          zIndex: "999",
          display: "flex",
          justifyContent: "center",
          width: "3rem",
          height: "3rem",
          alignItems: "center",
          borderRadius: "50%",
        }}
        onClick={gotop}
      >
        <ArrowUp />
      </button>
    </div>
  );
};

export default GoToTop;
