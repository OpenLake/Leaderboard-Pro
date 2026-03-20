import { useSidebar } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
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
  Calendar as CalendarIcon,
  Zap,
} from "lucide-react";
import { useAuth } from "@/Context/AuthContext";
import { cn } from "@/lib/utils";
import Heatmap from "@/components/Heatmap"; // Import the Heatmap component
import { PlatformStreakFetcher } from "@/components/PlatformStreakFetcher"; // Import the hidden streak fetcher
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import Chart from "react-apexcharts";

var rank = 0;

function Cards({ usernames }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return (
      <div className="col-span-full flex flex-col gap-8">
        <Card className="relative overflow-hidden border-none bg-slate-900 dark:bg-slate-950 py-12 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Level Up Your Coding Journey
            </h2>
            <p className="mb-8 max-w-2xl text-lg text-slate-300 lg:text-xl">
              Leaderboard Pro is the ultimate platform to track your ratings, 
              analyze your performance, and compete with friends across all major platforms.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="h-12 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white border-none"
                onClick={() => navigate("/register")}
              >
                Join Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 border-slate-700 hover:border-slate-500 bg-transparent px-8 text-lg font-bold text-white hover:bg-slate-800"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>
          </div>
          {/* Decorative background elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: "Unified Leaderboards",
              desc: "Compare yourself with others across Codeforces, LeetCode, Github, and more.",
              icon: Trophy,
              color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20",
            },
            {
              title: "Performance Analytics",
              desc: "Deep dive into your contest history and submission patterns with rich visualizations.",
              icon: Zap,
              color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20",
            },
            {
              title: "Contest Calendar",
              desc: "Stay updated with all upcoming contests from all platforms in one place.",
              icon: CalendarIcon,
              color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20",
            },
          ].map((feature, i) => (
            <Card key={i} className="border-none bg-card hover:bg-accent transition-colors">
              <CardHeader>
                <div className={cn("mb-2 flex h-12 w-12 items-center justify-center rounded-xl", feature.color)}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-sm">
                  {feature.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  var CardInfo = [
    {
      title: "Overall Rank",
      icon: Trophy,
      info: `#${rank ?? "N/A"}`,
      suffix: "Among all users",
      hasHeatmap: false,
    },
    {
      title: "Codeforces Rating",
      icon: Code2,
      info: `${usernames?.codeforces?.rating ?? "N/A"}`,
      suffix: usernames?.codeforces?.username || "",
      hasHeatmap: true,
      platform: 'codeforces',
      heatmapLabel: "Contest Activity",
      username: usernames?.codeforces?.username || "",
    },
    {
      title: "LeetCode Problems",
      icon: Target,
      info: `${usernames?.leetcode?.total_solved ?? "N/A"}`,
      suffix: "Total solved",
      hasHeatmap: true,
      platform: 'leetcode',
      heatmapLabel: "Submission History",
      username: usernames?.leetcode?.username || "",
      easy_solved: usernames?.leetcode?.easy_solved || 0,
      medium_solved: usernames?.leetcode?.medium_solved || 0,
      hard_solved: usernames?.leetcode?.hard_solved || 0,
      calendarData: usernames?.leetcode?.calendar_data,
    },
    {
      title: "Github Contributions",
      icon: GitBranch,
      info: `${usernames?.github?.contributions ?? "N/A"}`,
      suffix: "This year",
      hasHeatmap: true,
      platform: 'github',
      heatmapLabel: "Commit History",
      username: usernames?.github?.username || "",
    },
  ];

  const donutOptions = {
    chart: {
      type: "donut",
      sparkline: {
        enabled: true,
      },
    },
    labels: ["Easy", "Medium", "Hard"],
    colors: ["#22c55e", "#eab308", "#ef4444"], // Green-500, Yellow-500, Red-500
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: false,
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val} solved`,
      },
    },
    legend: {
      show: false,
    },
    stroke: {
      show: true,
      width: 1,
      colors: ["transparent"],
    },
  };
  
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
              <info.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold mb-1">{info.info}</CardTitle>
                {info.suffix && (
                  <CardDescription className="text-xs">{info.suffix}</CardDescription>
                )}
              </div>
              
              {info.platform === 'leetcode' && (info.easy_solved > 0 || info.medium_solved > 0 || info.hard_solved > 0) && (
                <div className="h-16 w-16">
                  <Chart
                    options={donutOptions}
                    series={[info.easy_solved, info.medium_solved, info.hard_solved]}
                    type="donut"
                    width="100%"
                    height="100%"
                  />
                </div>
              )}
            </div>
            
            {/* Heatmap for Codeforces and GitHub */}
            {info.hasHeatmap && (
              <div className="mt-3">
                <div className="text-xs text-gray-500 mb-1">{info.heatmapLabel}</div>
                <Heatmap 
                  platform={info.platform} 
                  contributions={info.platform === 'github' ? (usernames?.github?.contributions || 0) : 0}
                  username={info.username}
                  calendarData={info.calendarData}
                />
              </div>
            )}
            
            {/* Hidden streak fetcher for platforms without heatmaps */}
            {!info.hasHeatmap && info.platform && info.username && (
              <PlatformStreakFetcher platform={info.platform} username={info.username} />
            )}
          </CardContent>
        </Card>
      ))}

      {/* Explicit streak fetchers for platforms without Cards */}
      {usernames?.atcoder?.username && (
        <PlatformStreakFetcher platform="atcoder" username={usernames.atcoder.username} />
      )}
      {usernames?.codechef?.username && (
        <PlatformStreakFetcher platform="codechef" username={usernames.codechef.username} />
      )}
    </div>
  );
}
function Overview() {
  return (
    <div className="flex justify-center p-8">
      <p className="text-4xl font-bold">Upcoming Feature</p>
    </div>
  );
}

function Analytics() {
  return (
    <div className="flex justify-center">
      <p className="content-center text-4xl font-bold">Upcoming Feature</p>
    </div>
  );
}

function Leaderboards() {
  return (
    <div className="flex justify-center">
      <p className="content-center text-4xl font-bold">Upcoming Feature</p>
    </div>
  );
}

function Friends() {
  return (
    <div className="flex justify-center">
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
  const { userNames } = useAuth();
  const greeting = userNames?.username
    ? `Welcome back, ${userNames.username}`
    : "Welcome to Leaderboard Pro";
  return (
    <div className="text-foreground flex flex-col gap-5 px-10 pb-10">
      <div className="text-3xl font-semibold">{greeting}</div>
      <Cards usernames={userNames} />
      <TabsView />
    </div>
  );
};

export default HomePage;
