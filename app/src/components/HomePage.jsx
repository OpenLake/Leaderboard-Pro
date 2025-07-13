import { useSidebar } from "./ui/sidebar";
const HomePage = () => {
  const { open } = useSidebar();
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: open ? "calc(100vw - var(--sidebar-width))" : "100vw",
      }}
    >
      <h1>LeaderBoard-Pro</h1>
      <h3>A Project Under OpenLake</h3>
    </div>
  );
};

export default HomePage;
