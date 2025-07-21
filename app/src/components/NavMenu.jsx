import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/Context/ThemeProvider";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export function NavMenu() {
  const { setTheme, theme } = useTheme();
  return (
    <NavigationMenu className="grid-row m-1 max-w-full border-b-1 pb-3">
      <div className="grid w-full grid-cols-5 grid-rows-1 gap-10">
        <div className={"col-start-1 col-end-3 grid"}>
          <NavigationMenuList className="justify-start">
            <NavigationMenuItem asChild>
              <SidebarTrigger className="text-foreground mr-4" />
            </NavigationMenuItem>
            <NavigationMenuItem className={"ml-auto flex grow"}>
              <Input
                className="w-full"
                placeholder="Search users, contests, problems..."
              ></Input>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
        <div className={"col-start-5 col-end-6 justify-end"}>
          <NavigationMenuList className="justify-end">
            <NavigationMenuItem className="flex flex-row gap-1" asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
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
            <NavigationMenuItem>
              <NavigationMenuLink>Avatar</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </div>
      </div>
    </NavigationMenu>
  );
}
