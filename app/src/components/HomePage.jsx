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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Trophy,
  Code2,
  Target,
  GitBranch,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import { cn } from "@/lib/utils";
import Heatmap from "@/components/Heatmap"; // Import the Heatmap component
import { useState } from "react";

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
      hasHeatmap: false,
    },
    {
      title: "Codeforces Rating",
      icon: Code2,
      info: `${usernames.codeforces?.rating ?? "N/A"}`,
      change: 100,
      suffix: "Title",
      hasHeatmap: true,
      platform: 'codeforces',
      heatmapLabel: "Contest Activity",
      username: usernames.codeforces?.username || "",
    },
    {
      title: "LeetCode Problems",
      icon: Target,
      info: `${usernames.leetcode?.total_solved ?? "N/A"}`,
      change: -100,
      suffix: "This month",
      hasHeatmap: false,
    },
    {
      title: "Github Contributions",
      icon: GitBranch,
      info: `${usernames.github?.contributions ?? "N/A"}`,
      change: 100,
      suffix: "This year",
      hasHeatmap: true,
      platform: 'github',
      heatmapLabel: "Commit History",
      username: usernames.github?.username || "",
    },
  ];
  
  return (
    <div className="col-span-full grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CardInfo.map((info) => (
        <Card
          id="codeforces"
          className="w-[100%] hover:shadow-md transition-all duration-300"
          key={info.title.split(" ")[0].toLowerCase()}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{info.title}</div>
              <CardAction>
                <info.icon className="h-5 w-5" />
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl font-bold mb-1">{info.info}</CardTitle>
            
            {/* Heatmap for Codeforces and GitHub */}
            {info.hasHeatmap && (
              <>
                <div className="text-xs text-gray-500 mb-1">{info.heatmapLabel}</div>
                <Heatmap 
                  platform={info.platform} 
                  contributions={info.platform === 'github' ? (usernames.github?.contributions || 0) : 0}
                  username={info.username}
                />
              </>
            )}
          </CardContent>
          <CardFooter className="pt-2">
            <CardDescription>
              <span
                className={
                  info.change > 0
                    ? cn("text-green-600 font-medium")
                    : cn("text-red-600 font-medium")
                }
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
function Overview() {
  return (
    <div className="flex size-full justify-center">
      <p className="content-center text-4xl font-bold">Upcoming Feature</p>
    </div>
  );
}

function Analytics() {
  return (
    <div className="flex size-full justify-center">
      <p className="content-center text-4xl font-bold">Upcoming Feature</p>
    </div>
  );
}

function Leaderboards() {
  return (
    <div className="flex size-full justify-center">
      <p className="content-center text-4xl font-bold">Upcoming Feature</p>
    </div>
  );
}

function Friends() {
  return (
    <div className="flex size-full justify-center">
      <p className="content-center text-4xl font-bold">Upcoming Feature</p>
    </div>
  );
}

function TabsView() {
  const tabs = [
    { title: "Overview", comp: Overview },
    { title: "Analytics", comp: Analytics },
    { title: "Leaderboards", comp: Leaderboards },
    { title: "Friends", comp: Friends },
  ];
  
  return (
    <div className="grow">
      <Tabs
        defaultValue={tabs[0].title.toLowerCase()}
        className="h-full w-full"
      >
        <TabsList className="w-[100%]">
          {tabs.map((item) => (
            <TabsTrigger
              value={item.title.toLowerCase()}
              key={item.title.toLowerCase()}
            >
              {item.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((item) => (
          <TabsContent
            key={item.title.toLowerCase()}
            value={item.title.toLowerCase()}
            className="h-full"
          >
            <item.comp />
          </TabsContent>
        ))}
      </Tabs>
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
      <TabsView />
    </div>
  );
};

export default HomePage;