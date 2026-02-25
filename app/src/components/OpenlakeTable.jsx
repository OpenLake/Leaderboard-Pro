import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { DataTable } from "./ui/data-table";
import { Input } from "@/components/ui/input";
import { Switch } from "./ui/switch";

const BACKEND = import.meta.env.VITE_BACKEND;
export function OpenLakeTable({ OLUsers }) {
  const [searchfield, setSearchfield] = useState("");
  const [prKeyInput, setPrKeyInput] = useState("");
  const [appliedPrKey, setAppliedPrKey] = useState("");
  const [keyFilteredUsers, setKeyFilteredUsers] = useState([]);
  const [isFetchingPrKeyData, setIsFetchingPrKeyData] = useState(false);
  const [filteredusers, setFilteredusers] = useState([]);
  const [todisplayusers, setTodisplayusers] = useState([]);
  const [OLFriends, setOLFriends] = useState([]);
  const [showOLFriends, setShowOLFriends] = useState(false);
  const { open, isMobile } = useSidebar();
  const sourceUsers = appliedPrKey ? keyFilteredUsers : OLUsers;
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
  ];
  const getccfriends = async () => {
    const response = await fetch(BACKEND + "/openlakeFL/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          JSON.parse(localStorage.getItem("authTokens")).access,
      },
    });

    const newData = await response.json();
    setOLFriends(newData);
  };

  async function addfriend(e) {
    const response = await fetch(BACKEND + "/openlakeFA/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          JSON.parse(localStorage.getItem("authTokens")).access,
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
    const response = await fetch(BACKEND + "/openlakeFD/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          JSON.parse(localStorage.getItem("authTokens")).access,
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
    getccfriends();
  }, []);

  useEffect(() => {
    if (!appliedPrKey) {
      setKeyFilteredUsers([]);
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const getPrKeyFilteredUsers = async () => {
      setIsFetchingPrKeyData(true);
      try {
        const response = await fetch(
          BACKEND + `/openlake/?pr_key=${encodeURIComponent(appliedPrKey)}`,
          { signal },
        );
        if (!response.ok) {
          setKeyFilteredUsers([]);
          return;
        }
        const data = await response.json();
        setKeyFilteredUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }
        setKeyFilteredUsers([]);
      } finally {
        setIsFetchingPrKeyData(false);
      }
    };

    getPrKeyFilteredUsers();

    return () => {
      controller.abort();
    };
  }, [appliedPrKey]);

  useEffect(() => {
    if (showOLFriends) {
      setTodisplayusers(
        sourceUsers.filter((OLUser) => OLFriends.includes(OLUser.username)),
      );
    } else {
      setTodisplayusers(sourceUsers);
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
  }, [showOLFriends, OLFriends, searchfield, sourceUsers]);
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
        <div className="flex w-[65%] flex-row gap-2">
          <Input
            placeholder="Search OpenLake contributors..."
            className="w-[55%]"
            onChange={(val) => setSearchfield(val.target.value)}
            type="search"
          />
          <Input
            placeholder="Filter by PR key (e.g. FOSSOVERFLOW-2025)"
            className="w-[45%]"
            value={prKeyInput}
            onChange={(e) => setPrKeyInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setAppliedPrKey(prKeyInput.trim());
              }
            }}
          />
          <Button
            variant="outline"
            onClick={() => setAppliedPrKey(prKeyInput.trim())}
          >
            Apply Key
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setPrKeyInput("");
              setAppliedPrKey("");
            }}
          >
            Clear
          </Button>
        </div>
        <div>
          Friends Only
          <Switch
            className="mx-1 align-middle"
            onCheckedChange={(val) => setShowOLFriends(val)}
          />
        </div>
      </div>
      {isFetchingPrKeyData ? (
        <div className="mb-2 text-sm text-muted-foreground">
          Loading key-based contributions...
        </div>
      ) : null}
      {appliedPrKey ? (
        <div className="mb-2 text-sm text-muted-foreground">
          Showing contributions for PR title key: [{appliedPrKey}]
        </div>
      ) : null}
      <DataTable data={filteredusers} columns={columns} />
    </div>
  );
}
