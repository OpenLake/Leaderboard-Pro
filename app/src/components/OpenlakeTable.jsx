import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DataTable } from "./ui/data-table";
import { Input } from "@/components/ui/input";
import { Switch } from "./ui/switch";

const BACKEND = import.meta.env.VITE_BACKEND;
export function OpenLakeTable({ OLUsers }) {
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
  const [OLFriends, setOLFriends] = useState([]);
  const [showOLFriends, setShowOLFriends] = useState(false);
  const { open, isMobile } = useSidebar();
  const columns = [
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
    ...(isAuthenticated
      ? [
          {
            id: "actions",
            cell: ({ row }) => {
              const username = row.getValue("username");
              return (
                <div className="flex justify-end">
                  {OLFriends.includes(username) ? (
                    <Button
                      variant="secondary"
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
      setOLFriends([]);
      return;
    }
    const response = await fetch(BACKEND + "/openlakeFL/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    });

    const newData = await response.json();
    setOLFriends(newData);
  };

  async function addfriend(e) {
    if (!accessToken) {
      alert("Please login to add friends.");
      return;
    }
    const response = await fetch(BACKEND + "/openlakeFA/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        friendName: e,
      }),
    });
    if (response.status !== 200) {
      alert("ERROR!!!!");
    } else {
      setOLFriends((current) => [...current, e]);
    }
  }
  async function dropfriend(e) {
    if (!accessToken) {
      alert("Please login to remove friends.");
      return;
    }
    const response = await fetch(BACKEND + "/openlakeFD/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({
        friendName: e,
      }),
    });
    if (response.status !== 200) {
      alert("ERROR!!!!");
    } else {
      setOLFriends((current) => current.filter((fruit) => fruit !== e));
    }
  }
  useEffect(() => {
    if (isAuthenticated) {
      getccfriends();
    } else {
      setOLFriends([]);
      setShowOLFriends(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (showOLFriends) {
      setTodisplayusers(
        OLUsers.filter((OLUser) => OLFriends.includes(OLUser.username)),
      );
    } else {
      setTodisplayusers(OLUsers);
    }
    if (searchfield === "") {
      setFilteredusers(todisplayusers);
    } else {
      setFilteredusers(
        todisplayusers.filter((cfUser) => {
          return cfUser.username
            .toLowerCase()
            .includes(searchfield.toLowerCase());
        }),
      );
    }
  }, [showOLFriends, OLFriends, searchfield, OLUsers]);
  useEffect(() => {
    if (searchfield === "") {
      setFilteredusers(todisplayusers);
    } else {
      setFilteredusers(
        todisplayusers.filter((cfUser) => {
          return cfUser.username
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
          placeholder="Search OpenLake contributors..."
          className="w-[40%]"
          onChange={(val) => setSearchfield(val.target.value)}
          type="search"
        />
        {isAuthenticated ? (
          <div>
            Friends Only
            <Switch
              className="mx-1 align-middle"
              onCheckedChange={(val) => setShowOLFriends(val)}
            />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Login to use friend actions
          </div>
        )}
      </div>
      <DataTable data={filteredusers} columns={columns} />
    </div>
  );
}
