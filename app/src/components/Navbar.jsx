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
} from "./ui/sidebar";
import {
  Calendar,
  Home,
  ChartColumn,
  Trophy,
  Users,
  Award,
  User,
} from "lucide-react";
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
  { title: "Profile", url: "profile", icon: User },
];
const links = ["Openlake", "Github", "LeetCode", "Codeforces", "Codechef"];
export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  return (
    <Sidebar>
      <SidebarHeader>Leaderboard Pro</SidebarHeader>
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
                var linkLower = link.toLowerCase();
                return (
                  <SidebarMenuItem key={link}>
                    <SidebarMenuButton asChild>
                      <Link to={linkLower}>
                        <img
                          src={`icons/${linkLower}.svg`}
                          className="mr-2 inline-flex h-5 w-5"
                        />
                        <span>{link}</span>
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
