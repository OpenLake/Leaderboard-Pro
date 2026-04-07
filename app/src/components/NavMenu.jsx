import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/Context/ThemeProvider";
import { useAuth } from "@/Context/AuthContext";
import { Sun, Moon, Flame } from "lucide-react";
import { Button } from "./ui/button";
import { useStreak } from "@/Context/StreakContext";
import Openlake from "@/icons/openlake.svg?react";

function LetterAvatar({ name }) {
  // Fallback prevents crashes when auth profile data is unavailable.
  const safeName =
    typeof name === "string" && name.trim().length > 0 ? name.trim() : "Guest";
  const initials = safeName[0].toUpperCase();
  return (
    <div className="text-foreground m-auto flex justify-center text-xl font-semibold">
      {initials}
    </div>
  );
}

export function NavMenu() {
  const { setTheme, theme } = useTheme();
  const { user, userNames } = useAuth();
  const { streaks } = useStreak();
  
  // Calculate maximum streak globally across all platforms
  const globalStreak = Math.max(
    streaks.codeforces || 0,
    streaks.github || 0,
    streaks.leetcode || 0,
    streaks.atcoder || 0,
    streaks.codechef || 0,
  );
  const displayName = userNames?.username || user?.username || "Guest";
  return (
    <NavigationMenu className="m-1 max-w-full border-b pb-3 block overflow-hidden flex-none">
      <div className="flex w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Logo and Search */}
        <div className="flex items-center gap-4 flex-1">
          <NavigationMenuList>
            <NavigationMenuItem asChild>
              <Link
                to="/"
                className="flex items-center gap-2"
                aria-label="Leaderboard Pro Home"
                title="Leaderboard Pro"
              >
                <Openlake className="h-7 w-7" />
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>

          {user && (
            <div className="hidden md:flex flex-1 max-w-md ml-4">
              <Input
                className="w-full"
                placeholder="Search users, contests, problems..."
              />
            </div>
          )}
        </div>

        {/* Right Section: Streaks, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NavigationMenuList className="flex items-center gap-2 sm:gap-4">
            {user && globalStreak >= 0 && (
              <NavigationMenuItem>
                <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-900/50 shadow-sm font-semibold text-sm">
                  <Flame className="h-4 w-4" />
                  <span>{globalStreak}</span>
                </div>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground rounded-full hover:bg-accent"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </NavigationMenuItem>

            {user ? (
              <NavigationMenuItem>
                <NavigationMenuLink asChild className="rounded-full">
                  <Link to="/profile" className="rounded-full">
                    <Avatar className="bg-accent size-9">
                      <LetterAvatar name={displayName} />
                    </Avatar>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : null}
          </NavigationMenuList>
        </div>
      </div>
    </NavigationMenu>
  );
}
