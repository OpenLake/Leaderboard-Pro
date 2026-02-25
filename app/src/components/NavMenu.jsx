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
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
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
          <NavigationMenuList className="justify-end">
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
