// components/Heatmap.jsx
import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const Heatmap = ({ platform, contributions, username }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (platform === 'github' && username) {
        await fetchGitHubContributions();
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
        processGitHubData(data.contributions, data.totalContributions);
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

  const processGitHubData = (contributions, totalContributions) => {
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
        
        weekData.push(level);
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
    
    for (let week = 0; week < weeks; week++) {
      const weekData = [];
      for (let day = 0; day < days; day++) {
        let level = 0;
        
        if (platform === 'codeforces') {
          // Codeforces: More activity on weekends (contest days)
          if (day >= 5) { // Saturday and Sunday
            level = Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 2 : 0;
          } else {
            level = Math.random() > 0.5 ? Math.floor(Math.random() * 2) + 1 : 0;
          }
        } else if (platform === 'github') {
          // GitHub: Use actual contributions if available
          if (contributions > 1000) {
            level = Math.random() > 0.2 ? Math.floor(Math.random() * 4) + 1 : 0;
          } else if (contributions > 500) {
            level = Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : 0;
          } else {
            level = Math.random() > 0.4 ? Math.floor(Math.random() * 2) + 1 : 0;
          }
        }
        
        weekData.push(level);
      }
      data.push(weekData);
    }
    
    setHeatmapData(data);
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

  const getTooltipText = (level, platform) => {
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
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
        <Calendar className="w-3 h-3" />
        <span>Last {heatmapData.length} weeks {getPlatformLabel()}</span>
      </div>
      <div className="flex gap-[2px]">
        {heatmapData.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[2px]">
            {week.map((day, dayIndex) => (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "w-3 h-3 rounded-sm transition-all duration-200 hover:scale-125 cursor-help",
                  getColorIntensity(day, platform)
                )}
                title={`${platform === 'codeforces' ? 'Codeforces' : 'GitHub'}: ${getTooltipText(day, platform)}`}
              />
            ))}
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