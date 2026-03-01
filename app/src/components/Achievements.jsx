import { useState, useEffect } from "react";
import { ACHIEVEMENTS } from "@/utils/achievements";
import { AchievementCard } from "./AchievementCard";
import { useAuth } from "@/Context/AuthContext";
import { useStreak } from "@/Context/StreakContext";

export default function Achievements() {
  const { user } = useAuth();
  const { globalStreak } = useStreak();
  const [stats, setStats] = useState(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const BACKEND = import.meta.env.VITE_BACKEND;

  // 1. Fetch user platform stats to evaluate current progress
  useEffect(() => {
    if (!user) return;
    
    // We can fetch from the endpoints we already have to build a combined `stats` object
    // For simplicity, we fetch all 5 endpoints for this user specifically.
    // In a real optimized app, we'd have a single /api/user/all_stats/ endpoint.
    const fetchPlatformData = async (platform) => {
      try {
        const res = await fetch(`${BACKEND}/${platform}/`);
        const data = await res.json();
        // The API returns all users. We need to find this user.
        // Usually, the app has a `UserNames` mapping or similar.
        // Assuming the auth context has `username` or we can find it:
        return data; 
      } catch (e) {
        console.warn(`Failed fetching ${platform} stats`);
        return [];
      }
    };

    const fetchAllStats = async () => {
       try {
           setIsLoading(true);
           // We need to fetch the UserNames mapping first to know the platform usernames
           const mappingRes = await fetch(`${BACKEND}/usernames/`);
           const mappings = await mappingRes.json();
           const userMapping = mappings.find(m => m.user === user.user_id);
           
           if (!userMapping) {
               setIsLoading(false);
               return;
           }
           
           const [gh, cf, lc, cc, ac, ol] = await Promise.all([
               fetchPlatformData('github'),
               fetchPlatformData('codeforces'),
               fetchPlatformData('leetcode'),
               fetchPlatformData('codechef'),
               fetchPlatformData('atcoder'),
               fetchPlatformData('openlake')
           ]);
           
           const combinedStats = {
               github: gh.find(u => u.username === userMapping.github),
               codeforces: cf.find(u => u.username === userMapping.codeforces),
               leetcode: lc.find(u => u.username === userMapping.leetcode),
               codechef: cc.find(u => u.username === userMapping.codechef),
               atcoder: ac.find(u => u.username === userMapping.atcoder),
               openlake: ol.find(u => u.username === userMapping.openlake)
           };
           
           setStats(combinedStats);
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
            headers: { 'Authorization': `Bearer ${user.access}` }
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
                     'Authorization': `Bearer ${user.access}`
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
