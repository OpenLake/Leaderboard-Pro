import { Button } from "@/components/ui/button.jsx";
import { Link, useNavigate } from "react-router-dom";
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
} from "@/components/ui/sidebar";

import {
  Calendar,
  Home,
  ChartColumn,
  Trophy,
  Users,
  Award,
} from "lucide-react";

import Openlake from "@/icons/openlake.svg?react";
import Github from "@/icons/github.svg?react";
import LeetCode from "@/icons/leetcode.svg?react";
import Codeforces from "@/icons/codeforces.svg?react";
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
    url: "/",
    icon: Users,
  },
  {
    title: "Contests",
    url: "/",
    icon: Calendar,
  },
  {
    title: "Achievements",
    url: "/",
    icon: Award,
  },
];

const links = [
  { title: "Openlake", icon: Openlake },
  { title: "Github", icon: Github },
  { title: "LeetCode", icon: LeetCode },
  { title: "Codeforces", icon: Codeforces },
  { title: "Codechef", icon: Codechef },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="flex-row justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Openlake className="h-6 w-6" />
          <span>Leaderboard Pro</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-extrabold">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="mr-1 inline-flex" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-extrabold">
            Leaderboards
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => {
                const linkLower = link.title.toLowerCase();
                return (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton asChild>
                      <Link to={linkLower}>
                        <link.icon className="h-5 w-5 fill-black dark:fill-white" />
                        <span>{link.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {(user ?? false) ? (
          <Button onClick={logoutUser}>Logout</Button>
        ) : (
          <Button onClick={() => navigate("/login")}>Login</Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};