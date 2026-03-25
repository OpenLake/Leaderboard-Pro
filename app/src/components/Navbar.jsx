import { Button } from "@/components/ui/button.jsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import {
  Calendar,
  Home,
  ChartColumn,
  Trophy,
  Users,
  Award,
  BookOpen,
  Building2,
} from "lucide-react";

import Github from "@/icons/github.svg?react";
import LeetCode from "@/icons/leetcode.svg?react";
import Codeforces from "@/icons/codeforces.svg?react";
import Atcoder from "@/icons/atcoder.svg?react";
import Codechef from "@/icons/codechef.svg?react";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Leaderboards",
    url: "/",
    icon: Trophy,
  },
  {
    title: "Analytics",
    url: "/",
    icon: ChartColumn,
  },
  {
    title: "Friends",
    url: "/friends",
    icon: Users,
  },
  {
    title: "Contests",
    url: "/contests",
    icon: Calendar,
  },
  {
    title: "Organizations",
    url: "/organizations",
    icon: Building2,
  },
  {
    title: "Achievements",
    url: "/achievements",
    icon: Award,
  },
  {
    title: "Blogs",
    url: "/blogs",
    icon: BookOpen,
  },
];

const links = [
  { title: "Github", icon: Github },
  { title: "LeetCode", icon: LeetCode },
  { title: "Codeforces", icon: Codeforces },
  { title: "Codechef", icon: Codechef },
  { title: "AtCoder", icon: Atcoder },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const { state } = useSidebar();
  const { pathname } = useLocation();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex-row items-center gap-2 p-2">
        <SidebarTrigger />
        <Link
          to="/"
          className={cn(
            "flex items-center gap-2 transition-all duration-300 ease-in-out",
            isCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto"
          )}
          aria-label="Leaderboard Pro Home"
          title="Leaderboard Pro">
          <span className="font-bold truncate">Leaderboard Pro</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup className="pt-12 pb-4">
          <SidebarGroupLabel 
            className={cn(
              "text-xl font-extrabold transition-all duration-300 ease-in-out",
              isCollapsed ? "opacity-0 invisible h-0" : "opacity-100 visible h-8"
            )}
          >
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => {
                const isActive = pathname === item.url;
                const isBlogs = index === 6;
                return (
                  <SidebarMenuItem 
                    key={item.title} 
                    className={cn(
                      "relative",
                      isBlogs && "mt-8" // Add distance before Blogs
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-foreground z-10 transition-all duration-300 ease-in-out" />
                    )}
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="relative"
                    >
                      <Link to={item.url} className="flex items-center w-full">
                        <item.icon />
                        <span className={cn(
                          "ml-2 transition-all duration-300 ease-in-out truncate",
                          isCollapsed ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto ml-2"
                        )}>
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-2 opacity-50" />

        <SidebarGroup className="py-4">
          <SidebarGroupLabel 
            className={cn(
              "text-xl font-extrabold transition-all duration-300 ease-in-out",
              isCollapsed ? "opacity-0 invisible h-0" : "opacity-100 visible h-8"
            )}
          >
            Leaderboards
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link, index) => {
                const linkLower = link.title.toLowerCase();
                const isActive = pathname === `/${linkLower}`;
                const isBeforeGithub = index === 0; 
                return (
                  <SidebarMenuItem 
                    key={link.title} 
                    className={cn(
                      "relative",
                      isBeforeGithub && "mt-10" // Add distance before Github
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-foreground z-10 transition-all duration-300 ease-in-out" />
                    )}
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={link.title}
                      className="relative"
                    >
                      <Link to={`/${linkLower}`} className="flex items-center w-full">
                        <link.icon className="h-5 w-5 fill-black dark:fill-white shrink-0" />
                        <span className={cn(
                          "ml-2 transition-all duration-300 ease-in-out truncate",
                          isCollapsed ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto ml-2"
                        )}>
                          {link.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 overflow-hidden">
        <div className={cn(
          "transition-all duration-300 ease-in-out w-full",
          isCollapsed ? "opacity-0 invisible h-0" : "opacity-100 visible h-auto"
        )}>
          {(user ?? false) ? (
            <Button onClick={logoutUser} className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none font-semibold truncate">Logout</Button>
          ) : (
            <Button onClick={() => navigate("/login")} className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none font-semibold truncate">Login</Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};