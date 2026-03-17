import React, { useState, useEffect } from "react";
import { useAuth } from "@/Context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Users, UserPlus, UserMinus, Search, Loader2, Github, Code2, Sword, Flame, Target, Trophy } from "lucide-react";

const BACKEND = import.meta.env.VITE_BACKEND;

const PLATFORMS = [
  { id: "codeforces", name: "Codeforces", icon: Sword, color: "text-red-500", suffix: "F" },
  { id: "codechef", name: "Codechef", icon: Target, color: "text-amber-600", suffix: "F" },
  { id: "leetcode", name: "LeetCode", icon: Code2, color: "text-orange-500", suffix: "F" },
  { id: "github", name: "GitHub", icon: Github, color: "text-blue-500", suffix: "F" },
  { id: "openlake", name: "OpenLake", icon: Flame, color: "text-fuchsia-500", suffix: "F" },
  { id: "atcoder", name: "Atcoder", icon: Trophy, color: "text-zinc-800", suffix: "F" },
];

export default function Friends() {
  const { user } = useAuth();
  const [activePlatform, setActivePlatform] = useState("codeforces");
  const [friends, setFriends] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchHandle, setSearchHandle] = useState("");
  const [addingFriend, setAddingFriend] = useState(false);

  const fetchFriends = async (platformId) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    if (!platform) return;

    try {
      const authTokens = JSON.parse(localStorage.getItem("authTokens"));
      const response = await fetch(`${BACKEND}/${platformId}${platform.suffix}L/`, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(prev => ({ ...prev, [platformId]: data }));
      }
    } catch (error) {
      console.error(`Error fetching ${platformId} friends:`, error);
    }
  };

  useEffect(() => {
    const loadAllFriends = async () => {
      setLoading(true);
      for (const platform of PLATFORMS) {
        await fetchFriends(platform.id);
      }
      setLoading(false);
    };

    if (user) {
      loadAllFriends();
    }
  }, [user]);

  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (!searchHandle.trim()) return;

    setAddingFriend(true);
    const platform = PLATFORMS.find(p => p.id === activePlatform);
    
    try {
      const authTokens = JSON.parse(localStorage.getItem("authTokens"));
      const response = await fetch(`${BACKEND}/${activePlatform}${platform.suffix}A/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({ friendName: searchHandle.trim() }),
      });

      if (response.ok) {
        setSearchHandle("");
        await fetchFriends(activePlatform);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add friend");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
    } finally {
      setAddingFriend(false);
    }
  };

  const handleRemoveFriend = async (handle) => {
    const platform = PLATFORMS.find(p => p.id === activePlatform);
    
    try {
      const authTokens = JSON.parse(localStorage.getItem("authTokens"));
      const response = await fetch(`${BACKEND}/${activePlatform}${platform.suffix}D/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({ friendName: handle }),
      });

      if (response.ok) {
        await fetchFriends(activePlatform);
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to manage your friends.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Friends</h1>
          <p className="text-muted-foreground">Manage your connections across all platforms.</p>
        </div>
        <Users className="h-10 w-10 text-primary opacity-20" />
      </div>

      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        <aside>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Platforms</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1 p-2">
              {PLATFORMS.map((platform) => (
                <Button
                  key={platform.id}
                  variant={activePlatform === platform.id ? "secondary" : "ghost"}
                  className="justify-start gap-3"
                  onClick={() => setActivePlatform(platform.id)}
                >
                  <platform.icon className={`h-4 w-4 ${platform.color}`} />
                  {platform.name}
                  <span className="ml-auto text-xs opacity-50">
                    {friends[platform.id]?.length || 0}
                  </span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </aside>

        <main>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{PLATFORMS.find(p => p.id === activePlatform)?.name} Friends</CardTitle>
                  <CardDescription>
                    Follow users on {PLATFORMS.find(p => p.id === activePlatform)?.name} to track their stats.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleAddFriend} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={`Enter ${PLATFORMS.find(p => p.id === activePlatform)?.name} handle...`}
                    className="pl-9"
                    value={searchHandle}
                    onChange={(e) => setSearchHandle(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={addingFriend || !searchHandle.trim()}>
                  {addingFriend ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                  Add
                </Button>
              </form>

              <div className="space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Loader2 className="mb-4 h-8 w-8 animate-spin" />
                    <p>Loading your friends...</p>
                  </div>
                ) : friends[activePlatform]?.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {friends[activePlatform].map((handle) => (
                      <Card key={handle} className="overflow-hidden">
                        <CardContent className="flex items-center gap-4 p-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{handle[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-1 flex-col overflow-hidden">
                            <span className="truncate font-semibold">{handle}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveFriend(handle)}
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                    <Users className="mb-4 h-12 w-12 opacity-20" />
                    <h3 className="text-lg font-medium text-foreground">No friends followed yet</h3>
                    <p className="max-w-[250px]">
                      Search for a handle above to start tracking your friends.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
