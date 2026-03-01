import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Avatar } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/Context/ThemeProvider";
import { useAuth } from "@/Context/AuthContext";
import { Sun, Moon, Flame } from "lucide-react";
import { Button } from "./ui/button";
import { useStreak } from "@/Context/StreakContext";

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
  
  // Calculate maximum streak globally
  const globalStreak = Math.max(streaks.codeforces || 0, streaks.github || 0);
  const displayName = userNames?.username || user?.username || "Guest";
  return (
    <NavigationMenu className="grid-row m-1 max-w-full border-b-1 pb-3">
      <div className="grid w-full grid-cols-5 grid-rows-1 gap-10">
        <div className={"col-start-1 col-end-3 my-2"}>
          <NavigationMenuList className="justify-start">
            <NavigationMenuItem asChild>
              <SidebarTrigger className="text-foreground mr-4" />
            </NavigationMenuItem>
            {(user ?? false) ? (
              <NavigationMenuItem className={"ml-auto flex grow"}>
                <Input
                  className="w-full"
                  placeholder="Search users, contests, problems..."
                ></Input>
              </NavigationMenuItem>
            ) : (
              <></>
            )}
          </NavigationMenuList>
        </div>
        <div className={"col-start-5 col-end-6"}>
          <NavigationMenuList className="justify-end items-center">
            {globalStreak >= 0 && (
              <NavigationMenuItem className="flex items-center justify-center mr-2">
                <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full border border-orange-200 dark:border-orange-900/50 shadow-sm font-semibold text-sm">
                  <Flame className="h-4 w-4" />
                  <span>{globalStreak}</span>
                </div>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem className="flex flex-row gap-1" asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground rounded-full"
                onClick={() => {
                  if (theme == "light") setTheme("dark");
                  else setTheme("light");
                }}
              >
                {theme == "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </NavigationMenuItem>
            {(user ?? false) ? (
              <NavigationMenuItem>
                <NavigationMenuLink asChild className="rounded-full">
                  <Link to="/profile" className="rounded-full">
                    <Avatar className="bg-accent size-9">
                      <LetterAvatar name={displayName} />
                    </Avatar>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ) : (
              <></>
            )}
          </NavigationMenuList>
        </div>
      </div>
    </NavigationMenu>
  );
}
