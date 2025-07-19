import { useSidebar } from "@/components/ui/sidebar";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trophy,
  Code2,
  Target,
  GitBranch,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
var rank = 0;

function Cards(usernames) {
  usernames = usernames.usernames;
  var CardInfo = [
    {
      title: "Overall Rank",
      icon: Trophy,
      info: `#${rank ?? "N/A"}`,
      change: 100,
      suffix: "Among all users",
    },
    {
      title: "Codeforces Rating",
      icon: Code2,
      info: `${usernames.codeforces.rating ?? "N/A"}`,
      change: 100,
      suffix: "Title",
    },
    {
      title: "LeetCode Problems",
      icon: Target,
      info: `${usernames.leetcode.total_solved ?? "N/A"}`,
      change: -100,
      suffix: "This month",
    },
    {
      title: "Github Contributions",
      icon: GitBranch,
      info: `${usernames.github.contributions ?? "N/A"}`,
      change: 100,
      suffix: "This year",
    },
  ];
  return (
    <div className="col-span-full grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CardInfo.map((info) => (
        <Card
          id="codeforces"
          className="w-[100%]"
          key={info.title.split(" ")[0].toLowerCase()}
        >
          <CardHeader>
            {info.title}
            <CardAction>
              <info.icon />
            </CardAction>
          </CardHeader>
          <CardContent>
            <CardTitle>{info.info}</CardTitle>
          </CardContent>
          <CardFooter>
            <CardDescription>
              <span
                className={`text-${info.change > 0 ? "green" : "red"}-600`}
              >
                {info.change > 0 ? (
                  <>
                    <ArrowUpRight className="inline-flex w-4" /> +
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="inline-flex w-4" />{" "}
                  </>
                )}
                {info.change}
              </span>{" "}
              {info.suffix}
            </CardDescription>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
const HomePage = () => {
  const { open, isMobile } = useSidebar();
  const { userNames } = useAuth();
  return (
    <div
      className="text-foreground flex h-[100%] flex-col gap-5 px-10"
      style={{
        width:
          open && !isMobile
            ? "calc(100vw - var(--sidebar-width))"
            : "100vw",
      }}
    >
      <div className="text-3xl font-semibold">
        Welcome back, {userNames.username}
      </div>
      <Cards usernames={userNames} />
    </div>
  );
};

export default HomePage;
