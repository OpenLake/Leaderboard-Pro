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
import { User } from "lucide-react";

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

export function CCTable({ codechefUsers }) {
  const { open, isMobile } = useSidebar();
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
  const [ccshowfriends, setCCshowfriends] = useState(false);
  const [codecheffriends, setCodecheffriends] = useState([]);
  const columns = [
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => {
        return (
          <Avatar>
            <AvatarImage src={row.getValue("avatar")} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
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
              href={`https://codeforces.com/profile/${username}`}
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
      accessorKey: "rating",
      header: "Rating",
    },
    {
      accessorKey: "max_rating",
      header: "Max Rating",
    },
    {
      accessorKey: "Global_rank",
      header: "Global Rank",
    },
    {
      accessorKey: "Country_rank",
      header: "Country Rank",
    },
    ...(isAuthenticated
      ? [
          {
            id: "actions",
            cell: ({ row }) => {
              const username = row.getValue("username");
              return (
                <div className="flex justify-end">
                  {codecheffriends.includes(username) ? (
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
  const getccfriends = async () => {
    if (!accessToken) {
      setCodecheffriends([]);
      return;
    }
    try {
      const response = await fetch(BACKEND + "/codechefFL/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      });
      const parsed = await readJsonIfAvailable(response);
      if (!response.ok || !parsed.isJson) {
        console.error("Failed to fetch CodeChef friends:", parsed.message);
        setCodecheffriends([]);
        return;
      }
      const newData = parsed.data;
      setCodecheffriends(Array.isArray(newData) ? newData : []);
    } catch (error) {
      console.error("Failed to fetch CodeChef friends:", error);
      setCodecheffriends([]);
    }
  };

  async function addfriend(e) {
    if (!accessToken) {
      alert("Please login to add friends.");
      return;
    }
    try {
      const response = await fetch(BACKEND + "/codechefFA/", {
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
        console.error("Failed to add CodeChef friend:", parsed.message);
        alert("ERROR!!!!");
        return;
      }
      setCodecheffriends((current) => [...current, e]);
    } catch (error) {
      console.error("Failed to add CodeChef friend:", error);
      alert("ERROR!!!!");
    }
  }
  async function dropfriend(e) {
    if (!accessToken) {
      alert("Please login to remove friends.");
      return;
    }
    try {
      const response = await fetch(BACKEND + "/codechefFD/", {
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
        console.error("Failed to remove CodeChef friend:", parsed.message);
        alert("ERROR!!!!");
        return;
      }
      setCodecheffriends((current) =>
        current.filter((fruit) => fruit !== e),
      );
    } catch (error) {
      console.error("Failed to remove CodeChef friend:", error);
      alert("ERROR!!!!");
    }
  }
  useEffect(() => {
    if (isAuthenticated) {
      getccfriends();
    } else {
      setCodecheffriends([]);
      setCCshowfriends(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (ccshowfriends) {
      setTodisplayusers(
        codechefUsers.filter((codechefUser) =>
          codecheffriends.includes(codechefUser.username),
        ),
      );
    } else {
      setTodisplayusers(codechefUsers);
    }
    if (searchfield === "") {
      setFilteredusers(todisplayusers);
    } else {
      setFilteredusers(
        todisplayusers.filter((ccUser) => {
          return ccUser.username
            .toLowerCase()
            .includes(searchfield.toLowerCase());
        }),
      );
    }
  }, [ccshowfriends, codecheffriends, searchfield, codechefUsers]);
  useEffect(() => {
    if (searchfield === "") {
      setFilteredusers(todisplayusers);
    } else {
      setFilteredusers(
        todisplayusers.filter((ccUser) => {
          return ccUser.username
            .toLowerCase()
            .includes(searchfield.toLowerCase());
        }),
      );
    }
  }, [searchfield, todisplayusers]);
  return (
    <div
      className="h-full px-1.5 py-1"
      style={{
        width:
          open && !isMobile
            ? "calc(100vw - var(--sidebar-width))"
            : "100vw",
      }}
    >
      <div className="mb-2 flex flex-row justify-between">
        <Input
          placeholder="Search Codechef users..."
          className="w-[40%]"
          onChange={(val) => setSearchfield(val.target.value)}
          type="search"
        />
        {isAuthenticated ? (
          <div>
            Friends Only
            <Switch
              className="mx-1 align-middle"
              onCheckedChange={(val) => setCCshowfriends(val)}
            />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Login to use friend actions
          </div>
        )}
      </div>
      <DataTable
        data={filteredusers.sort((a, b) => (a.rating < b.rating ? 1 : -1))}
        columns={columns}
      />
    </div>
  );
}
