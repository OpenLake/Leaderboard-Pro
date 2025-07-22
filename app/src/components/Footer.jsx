import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <div className="text-foreground bg-accent flex h-8 justify-center">
      <span>Copyright ©</span>
      <Button variant="link" className="h-fit px-2 py-0.5" asChild>
        <a href="https://github.com/OpenLake/Leaderboard-Pro/">
          LeaderBoard-Pro
        </a>
      </Button>
      {`${new Date().getFullYear().toString()}.`}
    </div>
  );
};

export default Footer;
