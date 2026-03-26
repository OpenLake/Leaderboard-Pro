import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { DataTable } from "./ui/data-table";
import { Input } from "@/components/ui/input";
import { Switch } from "./ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
const BACKEND = import.meta.env.VITE_BACKEND;

const readJsonIfAvailable = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    const fallbackText = await response.text();
    return {
      isJson: false,
      data: null,
      message: fallbackText || `Unexpected response (${response.status})`,
    };
  }

  try {
    const data = await response.json();
    return { isJson: true, data, message: null };
  } catch {
    return { isJson: false, data: null, message: "Invalid JSON response" };
  }
};

export function GHTable({ githubUsers }) {
  let accessToken = null;
  try {
    accessToken = JSON.parse(localStorage.getItem("authTokens"))?.access || null;
  } catch {
    accessToken = null;
  }
  const isAuthenticated = Boolean(accessToken);
  const [searchfield, setSearchfield] = useState("");
  const [filteredusers, setFilteredusers] = useState([]);
  const [todisplayusers, setTodisplayusers] = useState([]);
  const [githubfriends, setGithubfriends] = useState([]);
  const [ghshowfriends, setGHshowfriends] = useState(false);
  const { open, isMobile } = useSidebar();
  const columns = [
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => {
        return (
          <Avatar>
            <AvatarImage src={row.getValue("avatar")} />
            <AvatarFallback>{row.getValue("username")}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const username = row.getValue("username");
        return (
          <Button variant="link" asChild>
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
            >
              {username}
            </a>
          </Button>
        );
      },
    },
    {
      accessorKey: "contributions",
      header: "Contributions",
    },
    {
      accessorKey: "repositories",
      header: "Repositories",
    },
    {
      accessorKey: "stars",
      header: "Stars",
    },
    ...(isAuthenticated
      ? [
          {
            id: "actions",
            cell: ({ row }) => {
              const username = row.getValue("username");
              return (
                <div className="flex justify-end">
                  {githubfriends.includes(username) ? (
                    <Button
                      variant="outline"
                      onClick={() => dropfriend(username)}
                    >
                      Remove Friend
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={() => addfriend(username)}
                    >
                      Add Friend
                    </Button>
                  )}
                </div>
              );
            },
          },
        ]
      : []),
  ];
  const getghfriends = async () => {
    if (!accessToken) {
      setGithubfriends([]);
      return;
    }
    try {
      const response = await fetch(BACKEND + "/githubFL/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      const parsed = await readJsonIfAvailable(response);
      if (!response.ok || !parsed.isJson) {
        console.error("Failed to fetch GitHub friends:", parsed.message);
        setGithubfriends([]);
        return;
      }
      const newData = parsed.data;
      setGithubfriends(Array.isArray(newData) ? newData : []);
    } catch (error) {
      console.error("Failed to fetch GitHub friends:", error);
      setGithubfriends([]);
    }
  };

  async function addfriend(e) {
    if (!accessToken) {
      alert("Please login to add friends.");
      return;
    }
    try {
      const response = await fetch(BACKEND + "/githubFA/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
          friendName: e,
        }),
      });
      const parsed = await readJsonIfAvailable(response);
      if (!response.ok) {
        console.error("Failed to add GitHub friend:", parsed.message);
        alert("ERROR!!!!");
        return;
      }
      setGithubfriends((current) => [...current, e]);
    } catch (error) {
      console.error("Failed to add GitHub friend:", error);
      alert("ERROR!!!!");
    }
  }
  async function dropfriend(e) {
    if (!accessToken) {
      alert("Please login to remove friends.");
      return;
    }
    try {
      const response = await fetch(BACKEND + "/githubFD/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
          friendName: e,
        }),
      });
      const parsed = await readJsonIfAvailable(response);
      if (!response.ok) {
        console.error("Failed to remove GitHub friend:", parsed.message);
        alert("ERROR!!!!");
        return;
      }
      setGithubfriends((current) =>
        current.filter((fruit) => fruit !== e),
      );
    } catch (error) {
      console.error("Failed to remove GitHub friend:", error);
      alert("ERROR!!!!");
    }
  }
  useEffect(() => {
    if (isAuthenticated) {
      getghfriends();
    } else {
      setGithubfriends([]);
      setGHshowfriends(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (ghshowfriends) {
      setTodisplayusers(
        githubUsers.filter((ghUser) =>
          githubfriends.includes(ghUser.username),
        ),
      );
    } else {
      setTodisplayusers(githubUsers);
    }
    if (searchfield === "") {
      setFilteredusers(todisplayusers);
    } else {
      setFilteredusers(
        todisplayusers.filter((ghUser) => {
          return ghUser.username
            .toLowerCase()
            .includes(searchfield.toLowerCase());
        }),
      );
    }
  }, [ghshowfriends, githubfriends, searchfield, githubUsers]);
  useEffect(() => {
    if (searchfield === "") {
      setFilteredusers(todisplayusers);
    } else {
      setFilteredusers(
        todisplayusers.filter((ghUser) => {
          return ghUser.username
            .toLowerCase()
            .includes(searchfield.toLowerCase());
        }),
      );
    }
  }, [searchfield, todisplayusers]);
  return (
    <div className="h-full px-1.5 py-1">
      <div className="mb-2 flex flex-row justify-between">
        <Input
          placeholder="Search Github contributors..."
          className="w-[40%]"
          onChange={(val) => setSearchfield(val.target.value)}
          type="search"
        />
        {isAuthenticated ? (
          <div>
            Friends Only
            <Switch
              className="mx-1 align-middle"
              onCheckedChange={(val) => setGHshowfriends(val)}
            />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Login to use friend actions
          </div>
        )}
      </div>
      <DataTable
        data={filteredusers.sort((a, b) =>
          a.contributions < b.contributions ? 1 : -1,
        )}
        columns={columns}
      />
    </div>
  );
}
