import { Star, Trophy, Sword, Flame, Github, Code2, Target, Users, Code, Activity, Heart, GitMerge, Award } from "lucide-react";

export const ACHIEVEMENTS = {
  // 1. Open Source & GitHub
  contributor: {
    title: "The Contributor",
    description: "Make contributions (commits, PRs, issues) across GitHub repositories.",
    icon: Github,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    tiers: [
      { name: "Bronze", requirement: 50, label: "50 Contributions" },
      { name: "Silver", requirement: 100, label: "100 Contributions" },
      { name: "Gold", requirement: 500, label: "500 Contributions" },
      { name: "Platinum", requirement: 1000, label: "1,000 Contributions" }
    ],
    evaluate: (stats) => stats?.github?.contributions || 0
  },
  stars: {
    title: "Star Magnet",
    description: "Accumulate stars across your personal repositories.",
    icon: Star,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    tiers: [
      { name: "Bronze", requirement: 10, label: "10 Stars" },
      { name: "Silver", requirement: 50, label: "50 Stars" },
      { name: "Gold", requirement: 100, label: "100 Stars" },
      { name: "Platinum", requirement: 500, label: "500 Stars" }
    ],
    evaluate: (stats) => stats?.github?.stars || 0
  },
  architect: {
    title: "The Architect",
    description: "Create and manage repositories on GitHub.",
    icon: GitMerge,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    tiers: [
      { name: "Bronze", requirement: 5, label: "5 Repositories" },
      { name: "Silver", requirement: 10, label: "10 Repositories" },
      { name: "Gold", requirement: 25, label: "25 Repositories" },
      { name: "Platinum", requirement: 50, label: "50 Repositories" }
    ],
    evaluate: (stats) => stats?.github?.repositories || 0
  },

  // 2. Competitive Programming
  cf_gladiator: {
    title: "The Gladiator",
    description: "Participate in rated contests on Codeforces.",
    icon: Sword,
    color: "text-red-500",
    bg: "bg-red-500/10",
    tiers: [
      { name: "Bronze", requirement: 5, label: "5 Contests" },
      { name: "Silver", requirement: 10, label: "10 Contests" },
      { name: "Gold", requirement: 25, label: "25 Contests" },
      { name: "Platinum", requirement: 50, label: "50 Contests" }
    ],
    evaluate: (stats) => {
        // We do not have exactly "number of contests" in user model, 
        // but we have `rating_updates` list or similar if we fetch it.
        // For now, let's tie this to total_solved on Codeforces or Codechef
        return stats?.codeforces?.total_solved || 0;
    }
  }, // We will skip the Gladiator or map it to total solved
  grand_ascent: {
    title: "The Grand Ascent",
    description: "Reach elite competitive programming ratings.",
    icon: Trophy,
    color: "text-amber-600",
    bg: "bg-amber-600/10",
    tiers: [
      { name: "Bronze", requirement: 1200, label: "1200 Rating" },
      { name: "Silver", requirement: 1400, label: "1400 Rating" },
      { name: "Gold", requirement: 1600, label: "1600 Rating" },
      { name: "Platinum", requirement: 1900, label: "1900 Rating" }
    ],
    evaluate: (stats) => Math.max(stats?.codeforces?.rating || 0, stats?.codechef?.rating || 0)
  },
  agnostic: {
    title: "Platform Agnostic",
    description: "Hold an active, rated rank on multiple platforms.",
    icon: Target,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    tiers: [
      { name: "Bronze", requirement: 1, label: "1 Platform" },
      { name: "Silver", requirement: 2, label: "2 Platforms" },
      { name: "Gold", requirement: 3, label: "All 3 Platforms (CF, CC, AC)" }
    ],
    evaluate: (stats) => {
      let count = 0;
      if (stats?.codeforces?.rating > 0) count++;
      if (stats?.codechef?.rating > 0) count++;
      if (stats?.atcoder?.rating > 0) count++;
      return count;
    }
  },

  // 3. LeetCode & DSA
  grindset: {
    title: "The Grindset",
    description: "Solve problems on LeetCode.",
    icon: Code2,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    tiers: [
      { name: "Bronze", requirement: 50, label: "50 Solved" },
      { name: "Silver", requirement: 100, label: "100 Solved" },
      { name: "Gold", requirement: 250, label: "250 Solved" },
      { name: "Platinum", requirement: 500, label: "500 Solved" }
    ],
    evaluate: (stats) => stats?.leetcode?.total_solved || 0
  },
  hardboiled: {
    title: "Hardboiled",
    description: "Solve Hard difficulty problems on LeetCode.",
    icon: Flame,
    color: "text-red-600",
    bg: "bg-red-600/10",
    tiers: [
      { name: "Bronze", requirement: 10, label: "10 Hard Solved" },
      { name: "Silver", requirement: 50, label: "50 Hard Solved" },
      { name: "Gold", requirement: 100, label: "100 Hard Solved" },
      { name: "Platinum", requirement: 250, label: "250 Hard Solved" }
    ],
    evaluate: (stats) => stats?.leetcode?.hard_solved || 0
  },
  medium_master: {
    title: "Medium Master",
    description: "Solve Medium difficulty problems on LeetCode.",
    icon: Code,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    tiers: [
      { name: "Bronze", requirement: 50, label: "50 Medium Solved" },
      { name: "Silver", requirement: 100, label: "100 Medium Solved" },
      { name: "Gold", requirement: 200, label: "200 Medium Solved" },
      { name: "Platinum", requirement: 500, label: "500 Medium Solved" }
    ],
    evaluate: (stats) => stats?.leetcode?.medium_solved || 0
  },

  // 4. Hybrid & Community
  streaker: {
    title: "Unstoppable Force",
    description: "Maintain a coding streak on any platform.",
    icon: Activity,
    color: "text-fuchsia-500",
    bg: "bg-fuchsia-500/10",
    tiers: [
      { name: "Bronze", requirement: 7, label: "7 Day Streak" },
      { name: "Silver", requirement: 30, label: "30 Day Streak" },
      { name: "Gold", requirement: 100, label: "100 Day Streak" },
      { name: "Platinum", requirement: 365, label: "365 Day Streak" }
    ],
    evaluate: (stats, globalStreak) => globalStreak || 0
  },
  mentor: { // We don't have user's total blog likes easily aggregated yet, so skipping or adapting
    title: "The Mentor",
    description: "Support open source contribution on Openlake.",
    icon: Heart,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    tiers: [
      { name: "Bronze", requirement: 5, label: "5 OL Contributions" },
      { name: "Silver", requirement: 10, label: "10 OL Contributions" },
      { name: "Gold", requirement: 50, label: "50 OL Contributions" },
      { name: "Platinum", requirement: 100, label: "100 OL Contributions" }
    ],
    evaluate: (stats) => stats?.openlake?.contributions || 0
  }
};
