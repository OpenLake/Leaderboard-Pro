import { Button } from "@/components/ui/button.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "@/Context/ThemeProvider";
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
import { Switch } from "@/components/ui/switch";
import {
    Calendar,
    Home,
    ChartColumn,
    Trophy,
    Users, // Used for Friends icon
    Award,
    User,
    Sun,
    Moon,
} from "lucide-react";
// Assuming these are SVG components imported via a Vite plugin (e.g., vite-plugin-svgr)
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
        url: "/leaderboards",
        icon: Trophy,
    },
    {
        title: "Analytics",
        url: "/analytics",
        icon: ChartColumn,
    },
    {
        title: "Friends",
        url: "/friends", // <-- The necessary functional change
        icon: Users,
    },
    {
        title: "Contests",
        url: "/contests",
        icon: Calendar,
    },
    {
        title: "Achievements",
        url: "/achievements",
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
    const { setTheme, theme } = useTheme();

    // Helper to toggle theme
    const handleThemeToggle = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <Sidebar>
            <SidebarHeader className="flex-row justify-between">
                Leaderboard Pro
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
                                var linkLower = link.title.toLowerCase();
                                return (
                                    <SidebarMenuItem key={link.title}>
                                        <SidebarMenuButton asChild>
                                            <Link to={linkLower}>
                                                {/* Note: SVG fill color controlled via Tailwind classes */}
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
                
                {/* Theme Toggle in Content Area */}
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xl font-extrabold">
                        Settings
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenuItem className="flex items-center justify-between">
                            <span className="flex items-center text-sm font-medium">
                                {theme === 'dark' ? (
                                    <Moon className="h-5 w-5 mr-2" />
                                ) : (
                                    <Sun className="h-5 w-5 mr-2" />
                                )}
                                Toggle Theme
                            </span>
                            <Switch 
                                checked={theme === 'dark'} 
                                onCheckedChange={handleThemeToggle} 
                            />
                        </SidebarMenuItem>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>

            <SidebarFooter>
                {/* User Profile Link (Placeholder for now) */}
                <div className="mb-2">
                    <SidebarMenuButton asChild>
                        <Link to="/profile">
                            <User className="h-5 w-5 mr-2" />
                            <span>{user ? user.username : 'User Profile'}</span>
                        </Link>
                    </SidebarMenuButton>
                </div>
                
                {/* Login/Logout Button */}
                {(user ?? false) ? (
                    <Button onClick={logoutUser} className="w-full">
                        Logout
                    </Button>
                ) : (
                    <Button onClick={() => navigate("/login")} className="w-full">
                        Login
                    </Button>
                )}
            </SidebarFooter>
        </Sidebar>
    );
};
