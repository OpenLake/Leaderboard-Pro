// components/Heatmap.jsx
import { useState, useEffect } from "react";
import { Calendar, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStreak } from "@/Context/StreakContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Heatmap = ({ platform, username }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [streakCells, setStreakCells] = useState(new Set());
  const { updateStreak } = useStreak();
  
  useEffect(() => {
    const fetchData = async () => {
      if (platform === 'github' && username) {
        await fetchGitHubContributions();
      } else if (platform === 'codeforces' && username) {
        await fetchCodeforcesData();
      } else {
        generateMockData();
      }
    };
    
    fetchData();
  }, [platform, username]);

  const fetchGitHubContributions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using the GitHub contributions API
      const response = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
      const data = await response.json();
      
      console.log("GitHub API Response:", data); // Debug log
      
      if (data && data.contributions) {
        // Process the 2D array format
        processGitHubData(data.contributions);
      } else {
        setError("No contribution data found");
        generateMockData();
      }
    } catch (error) {
      console.error("Error fetching GitHub contributions:", error);
      setError("Failed to load contributions");
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const fetchCodeforcesData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://codeforces.com/api/user.status?handle=${username}`);
      const data = await response.json();
      
      if (data && data.status === "OK") {
        processCodeforcesData(data.result);
      } else {
        setError("Failed to fetch Codeforces data");
        generateMockData();
      }
    } catch (error) {
      console.error("Error fetching Codeforces contributions:", error);
      setError("Failed to load contributions");
      generateMockData();
    } finally {
      setLoading(false);
    }
  };
  
  const processCodeforcesData = (submissions) => {
    // Process the submissions into a 12-week grid like GitHub
    const now = new Date();
    // Start from Sunday 12 weeks ago
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - (now.getDay()) - (11 * 7));
    startDate.setHours(0, 0, 0, 0);
    
    // Group submissions by day
    const dailyCounts = {};
    submissions.forEach(sub => {
      if (sub.verdict === "OK") {
        const subDate = new Date(sub.creationTimeSeconds * 1000);
        if (subDate >= startDate && subDate <= now) {
          const dayStr = subDate.toISOString().split('T')[0];
          dailyCounts[dayStr] = (dailyCounts[dayStr] || 0) + 1;
        }
      }
    });

    const heatmapArray = [];
    let currentDate = new Date(startDate);
    
    for (let week = 0; week < 12; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const dayStr = currentDate.toISOString().split('T')[0];
        const count = dailyCounts[dayStr] || 0;
        
        let level = 0;
        if (count > 0) {
          if (count >= 4) level = 4;
          else if (count >= 3) level = 3;
          else if (count >= 2) level = 2;
          else level = 1;
        }
        
        weekData.push({ level, date: dayStr, count });
        
        // Advance one day
        currentDate.setDate(currentDate.getDate() + 1);
        // Break if we passed today
        if (currentDate > now) {
            // Fill rest of the week with 0s if it's the current week and we haven't reached the end
            while(weekData.length < 7) {
                weekData.push({ level: 0, date: currentDate.toISOString().split('T')[0], count: 0 });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            break;
        }
      }
      heatmapArray.push(weekData);
      if (currentDate > now) break;
    }
    
    setHeatmapData(heatmapArray);
    calculateStreak(heatmapArray);
  };

  const processGitHubData = (contributions) => {
    // The API returns a 2D array where each inner array is a week
    // We need to take the last 12 weeks for our heatmap
    const totalWeeks = contributions.length;
    const weeksToShow = 12;
    const startWeek = Math.max(0, totalWeeks - weeksToShow);
    
    const heatmapArray = [];
    
    for (let week = startWeek; week < totalWeeks; week++) {
      const weekData = [];
      const currentWeek = contributions[week];
      
      for (let day = 0; day < currentWeek.length; day++) {
        const dayData = currentWeek[day];
        
        // Convert contributionLevel to intensity (0-4)
        let level = 0;
        switch (dayData.contributionLevel) {
          case "NONE":
            level = 0;
            break;
          case "FIRST_QUARTILE":
            level = 1;
            break;
          case "SECOND_QUARTILE":
            level = 2;
            break;
          case "THIRD_QUARTILE":
            level = 3;
            break;
          case "FOURTH_QUARTILE":
            level = 4;
            break;
          default:
            level = 0;
        }
        
        weekData.push({ level, date: dayData.date ? dayData.date.split('T')[0] : "Unknown", count: dayData.contributionCount || 0 });
      }
      
      heatmapArray.push(weekData);
    }
    
    console.log("Processed heatmap data:", heatmapArray); // Debug log
    setHeatmapData(heatmapArray);
  };

  const generateMockData = () => {
    const weeks = 12;
    const days = 7;
    const data = [];
    
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - (now.getDay()) - ((weeks - 1) * 7));
    
    for (let week = 0; week < weeks; week++) {
      const weekData = [];
      for (let day = 0; day < days; day++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + (week * days) + day);
        weekData.push({ level: 0, date: cellDate.toISOString().split('T')[0], count: 0 });
      }
      data.push(weekData);
    }
    
    setHeatmapData(data);
    setCurrentStreak(0);
    setStreakCells(new Set());
    // Don't call updateStreak with 0 for mock data, as it might clobber 
    // real streaks from other platforms that have already loaded.
  };

  const calculateStreak = (data) => {
    let streak = 0;
    const flatData = data.flat();
    const newStreakCells = new Set();
    
    for (let i = flatData.length - 1; i >= 0; i--) {
      // If the contribution level is greater than 0, increment streak
      const level = typeof flatData[i] === 'object' ? flatData[i].level : flatData[i];
      if (level > 0) {
        streak++;
        newStreakCells.add(i);
      } else {
        if (i === flatData.length - 1) {
             continue;
        } else {
           break;
        }
      }
    }
    setCurrentStreak(streak);
    setStreakCells(newStreakCells);
    if (updateStreak && platform) {
        updateStreak(platform, streak);
    }
  };

  const getColorIntensity = (level, platform) => {
    if (platform === 'codeforces') {
      const codeforcesColors = [
        "bg-gray-100 dark:bg-gray-800",        
        "bg-red-100 dark:bg-red-900",         
        "bg-red-300 dark:bg-red-700",         
        "bg-red-500 dark:bg-red-600",         
        "bg-red-700 dark:bg-red-500",         
      ];
      return codeforcesColors[level] || codeforcesColors[0];
    } else {
      const githubColors = [
        "bg-gray-100 dark:bg-gray-800",        
        "bg-green-100 dark:bg-green-900",       
        "bg-green-300 dark:bg-green-700",       
        "bg-green-500 dark:bg-green-600",       
        "bg-green-700 dark:bg-green-500",       
      ];
      return githubColors[level] || githubColors[0];
    }
  };

  const getTooltipText = (level, platform, count) => {
    if (count !== undefined) {
      if (platform === 'codeforces') {
        return `${count} submission${count !== 1 ? 's' : ''}`;
      } else {
        return `${count} contribution${count !== 1 ? 's' : ''}`;
      }
    }
    
    // Fallback if count isn't provided
    if (platform === 'codeforces') {
      const activities = ["No activity", "1-2 problems", "3-5 problems", "Contest + problems", "Multiple contests"];
      return activities[level] || "No activity";
    } else {
      const commits = ["No contributions", "1-4 commits", "5-9 commits", "10-19 commits", "20+ commits"];
      return commits[level] || "No contributions";
    }
  };

  const getPlatformLabel = () => {
    return platform === 'codeforces' ? "Contest Activity" : "Commit History";
  };

  const getLegendColors = () => {
    if (platform === 'codeforces') {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
          <div className="w-2 h-2 bg-red-100 dark:bg-red-900 rounded-sm"></div>
          <div className="w-2 h-2 bg-red-300 dark:bg-red-700 rounded-sm"></div>
          <div className="w-2 h-2 bg-red-500 dark:bg-red-600 rounded-sm"></div>
          <div className="w-2 h-2 bg-red-700 dark:bg-red-500 rounded-sm"></div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
          <div className="w-2 h-2 bg-green-100 dark:bg-green-900 rounded-sm"></div>
          <div className="w-2 h-2 bg-green-300 dark:bg-green-700 rounded-sm"></div>
          <div className="w-2 h-2 bg-green-500 dark:bg-green-600 rounded-sm"></div>
          <div className="w-2 h-2 bg-green-700 dark:bg-green-500 rounded-sm"></div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="mt-3">
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Calendar className="w-3 h-3" />
          <span>Loading {getPlatformLabel()}...</span>
        </div>
        <div className="flex gap-[2px]">
          {[...Array(12)].map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {[...Array(7)].map((_, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-gray-700 animate-pulse"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3">
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Calendar className="w-3 h-3" />
          <span className="text-red-500">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2 font-medium">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>Last {heatmapData.length} weeks {getPlatformLabel()}</span>
        </div>
        <div className="flex items-center gap-1 text-orange-500 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800/50 whitespace-nowrap">
          <Flame className="w-3.5 h-3.5" />
          <span>{currentStreak} </span>
        </div>
      </div>
      <div className="flex gap-[2px]">
        {heatmapData.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[2px]">
            {week.map((day, dayIndex) => {
              const flatIndex = weekIndex * 7 + dayIndex;
              const isStreak = streakCells.has(flatIndex);
              const itemLevel = typeof day === 'object' ? (day.level || 0) : day;
              const titleText = typeof day === 'object' && day.date ? `${day.date}: ${getTooltipText(itemLevel, platform, day.count)}` : `${platform === 'codeforces' ? 'Codeforces' : 'GitHub'}: ${getTooltipText(itemLevel, platform)}`;
              return (
              <TooltipProvider key={`${weekIndex}-${dayIndex}`} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 cursor-help",
                        getColorIntensity(itemLevel, platform),
                        (isStreak && itemLevel > 0) && "ring-1 ring-orange-500 shadow-[0_0_4px_rgba(249,115,22,0.8)] z-10 scale-110"
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{titleText}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )})}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
        <span>Older</span>
        {getLegendColors()}
        <span>Recent</span>
      </div>
    </div>
  );
};

export default Heatmap;