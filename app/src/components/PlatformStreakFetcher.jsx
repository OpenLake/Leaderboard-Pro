import { useEffect } from "react";
import { useStreak } from "@/Context/StreakContext";

// Component to fetch streaks for platforms that don't have a heatmap rendered.
// Rendered hidden inside App.jsx or HomePage.jsx
export function PlatformStreakFetcher({ platform, username }) {
  const { updateStreak } = useStreak();

  useEffect(() => {
    if (!username || !platform) return;

    const fetchLeetcodeStreak = async () => {
      try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/userProfileCalendar/${username}`);
        const data = await response.json();
        if (data && data.submissionCalendar) {
          const calendarString = data.submissionCalendar;
          // Clean the string to parse it properly
          const cleanString = calendarString.trim();
          
          let parsedCalendar;
          try {
            parsedCalendar = JSON.parse(cleanString);
          } catch(e) {
            console.error("Failed parsing leetcode calendar", e);
            updateStreak(platform, 0);
            return;
          }

          // parsedCalendar is an object with epochSeconds keys and count values.
          const keys = Object.keys(parsedCalendar).sort((a, b) => b - a); // descending
          
          let streak = 0;
          const now = new Date();
          now.setHours(0, 0, 0, 0);
          
          // Helper to get local date string from timestamp for matching
          // Since timestamps in leetcode are UTC midnight or specific localized time depending on logic,
          // Let's iterate backwards.
          for (let i = 0; i < keys.length; i++) {
            const timestamp = parseInt(keys[i], 10) * 1000;
            const subdate = new Date(timestamp);
            const dayDiff = Math.floor((now - subdate) / (1000 * 60 * 60 * 24));
            
            if (streak === 0) {
                if (dayDiff <= 1) { // Today or Yesterday
                    streak = 1;
                } else {
                    break;
                }
            } else {
                const prevTimestamp = parseInt(keys[i-1], 10) * 1000;
                const expectedDiff = (prevTimestamp - timestamp) / (1000 * 60 * 60 * 24);
                const roundedDiff = Math.round(expectedDiff);
                
                if (roundedDiff === 1) {
                    streak++;
                } else if (roundedDiff === 0) {
                    continue; // Same day skip
                } else {
                    break;
                }
            }
          }
          updateStreak(platform, streak);
        } else {
          updateStreak(platform, 0);
        }
      } catch (error) {
        console.error("Error fetching LeetCode streak:", error);
        updateStreak(platform, 0);
      }
    };

    const fetchAtcoderStreak = async () => {
      try {
        const response = await fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=${username}&from_second=0`);
        const submissions = await response.json();
        
        if (submissions && submissions.length > 0) {
          // Submissions has epoch_second
          const daysWithSubmissions = new Set();
          
          submissions.forEach(sub => {
             // Kenkoooo AtCoder Problems API usually includes a result/verdict. Optional but good.
             // Usually AC means accepted. We'll just count any submission for activity, 
             // or check sub.result === "AC". We will count any submission to match Codeforces logic.
             const subdate = new Date(sub.epoch_second * 1000);
             subdate.setHours(0, 0, 0, 0);
             daysWithSubmissions.add(subdate.getTime());
          });

          // Sort descending
          const sortedDays = Array.from(daysWithSubmissions).sort((a, b) => b - a);
          
          let streak = 0;
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          for (let i = 0; i < sortedDays.length; i++) {
            const dayTime = sortedDays[i];
            const dayDiff = Math.floor((now.getTime() - dayTime) / (1000 * 60 * 60 * 24));
            
            if (streak === 0) {
                if (dayDiff <= 1) { // Today or Yesterday
                    streak = 1;
                } else {
                    break;
                }
            } else {
                const prevTime = sortedDays[i-1];
                const expectedDiff = (prevTime - dayTime) / (1000 * 60 * 60 * 24);
                const roundedDiff = Math.round(expectedDiff);
                
                if (roundedDiff === 1) {
                    streak++;
                } else if (roundedDiff === 0) {
                    continue; // Same day skip
                } else {
                    break;
                }
            }
          }
          updateStreak(platform, streak);
        } else {
          updateStreak(platform, 0);
        }
      } catch (error) {
        console.error("Error fetching AtCoder streak:", error);
        updateStreak(platform, 0);
      }
    };

    const fetchCodechefStreak = async () => {
      try {
        const response = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
        const data = await response.json();
        
        if (data && data.heatMap) {
          // heatMap is an array of { date: "YYYY-MM-DD", value: number }
          const sortedEntries = data.heatMap
            .filter(entry => entry.value > 0)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
          
          if (sortedEntries.length === 0) {
            updateStreak(platform, 0);
            return;
          }

          let streak = 0;
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          for (let i = 0; i < sortedEntries.length; i++) {
            const entryDate = new Date(sortedEntries[i].date);
            entryDate.setHours(0, 0, 0, 0);
            
            if (streak === 0) {
              const diffTime = now.getTime() - entryDate.getTime();
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays <= 1) { // Today or Yesterday
                streak = 1;
              } else {
                break;
              }
            } else {
              const prevDate = new Date(sortedEntries[i-1].date);
              prevDate.setHours(0, 0, 0, 0);
              const diffTime = prevDate.getTime() - entryDate.getTime();
              const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays === 1) {
                streak++;
              } else if (diffDays === 0) {
                 continue; // Same day, skip
              } else {
                break;
              }
            }
          }
          updateStreak(platform, streak);
        } else {
          updateStreak(platform, 0);
        }
      } catch (error) {
        console.error("Error fetching CodeChef streak:", error);
        updateStreak(platform, 0);
      }
    };

    if (platform === "leetcode") {
      fetchLeetcodeStreak();
    } else if (platform === "atcoder") {
      fetchAtcoderStreak();
    } else if (platform === "codechef") {
      fetchCodechefStreak();
    }
  }, [platform, username, updateStreak]);

  return null;
}
