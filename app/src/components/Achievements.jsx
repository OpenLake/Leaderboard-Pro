import { useState, useEffect } from "react";
import { ACHIEVEMENTS } from "@/utils/achievements";
import { AchievementCard } from "./AchievementCard";
import { useAuth } from "@/Context/AuthContext";
import { useStreak } from "@/Context/StreakContext";

export default function Achievements() {
  const { user, authTokens } = useAuth();
  const { globalStreak } = useStreak();
  const [stats, setStats] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const BACKEND = import.meta.env.VITE_BACKEND;

  // 1. Fetch user platform stats to evaluate current progress
  useEffect(() => {
    if (!user) return;

    const fetchAllStats = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BACKEND}/userDetails/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        if (!res.ok) { setIsLoading(false); return; }
        const details = await res.json();

        // details = { username, email, codechef: {...}, codeforces: {...}, github: {...}, leetcode: {...}, atcoder: {...}, openlake: {...} }
        setStats({
          github: details.github || null,
          codeforces: details.codeforces || null,
          leetcode: details.leetcode || null,
          codechef: details.codechef || null,
          atcoder: details.atcoder || null,
          openlake: details.openlake || null,
        });
      } catch (error) {
        console.error("Error fetching stats for achievements", error);
      } finally {
        setIsLoading(false);
      }
    };

    // 2. Fetch already unlocked achievements from DB
    const fetchUnlocked = async () => {
      try {
        const res = await fetch(`${BACKEND}/achievements/`, {
          headers: { Authorization: `Bearer ${authTokens.access}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUnlockedAchievements(data);
        }
      } catch (e) {
        console.warn("Failed to fetch unlocked achievements", e);
      }
    };

    fetchAllStats();
    fetchUnlocked();
  }, [user, BACKEND]);

  // 3. Evaluate new unlocks
  useEffect(() => {
     if (!stats || !user) return;
     
     const unlockAchievement = async (slug, tier) => {
         try {
             const res = await fetch(`${BACKEND}/achievements/unlock/`, {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${authTokens.access}`
                 },
                 body: JSON.stringify({ slug, tier })
             });
             if (res.ok) {
                 const newUnlock = await res.json();
                 if (!newUnlock.message) { // Meaning it wasn't "Already unlocked"
                     setUnlockedAchievements(prev => [...prev, newUnlock]);
                 }
             }
         } catch(e) {
             console.error("Failed to post unlock", e);
         }
     };

     // Check every achievement against requirements
     Object.entries(ACHIEVEMENTS).forEach(([slug, def]) => {
         const currentValue = def.evaluate(stats, globalStreak);
         def.tiers.forEach(tier => {
             if (currentValue >= tier.requirement) {
                 // Check if we already have it
                 const hasIt = unlockedAchievements.some(u => u.slug === slug && u.tier === tier.name);
                 if (!hasIt) {
                     unlockAchievement(slug, tier.name);
                 }
             }
         });
     });

  }, [stats, user, BACKEND, globalStreak, unlockedAchievements]);


  if (isLoading) {
      return (
          <div className="flex justify-center flex-col items-center h-[80vh] w-[100%]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground animate-pulse">Calculating Tiers...</p>
          </div>
      );
  }

  return (
    <div className="container mx-auto p-6 md:p-8 space-y-8 animate-in fade-in zoom-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress across Open Source, Competitive Programming, and LeetCode. 
          Unlock higher tiers to prove your mastery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.entries(ACHIEVEMENTS).map(([slug, def]) => {
            const currentValue = stats ? def.evaluate(stats, globalStreak) : 0;
            const relevantUnlocks = unlockedAchievements.filter(u => u.slug === slug);
            
            return (
              <AchievementCard 
                key={slug}
                title={def.title}
                description={def.description}
                icon={def.icon}
                color={def.color}
                bg={def.bg}
                tiers={def.tiers}
                currentValue={currentValue}
                unlockedTiers={relevantUnlocks}
              />
            );
        })}
      </div>
    </div>
  );
}
