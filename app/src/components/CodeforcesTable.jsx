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

export function CFTable({ codeforcesUsers }) {
  const [searchfield, setSearchfield] = useState("");
  const [filteredusers, setFilteredusers] = useState([]);
  const [todisplayusers, setTodisplayusers] = useState([]);
  const { open, isMobile } = useSidebar();
  const [codeforcesfriends, setCodeforcesfriends] = useState([]);
  const [cfshowfriends, setCfshowfriends] = useState(false);
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
      accessorKey: "last_activity",
      header: "Last Activity",
      cell: ({ row }) => timeConverter(row.getValue("last_activity")),
    },
    {
      accessorKey: "total_solved",
      header: "Total solved",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const username = row.getValue("username");
        return (
          <div className="flex justify-end">
            {codeforcesfriends.includes(username) ? (
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
  ];

  const getcffriends = async () => {
    const response = await fetch(BACKEND + "/codeforcesFL/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          JSON.parse(localStorage.getItem("authTokens")).access,
      },
    });
    const newData = await response.json();
    setCodeforcesfriends(newData);
  };

  async function addfriend(e) {
    const response = await fetch(BACKEND + "/codeforcesFA/", {
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
      setCodeforcesfriends((current) => [...current, e]);
    }
  }
  async function dropfriend(e) {
    const response = await fetch(BACKEND + "/codeforcesFD/", {
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
      setCodeforcesfriends((current) =>
        current.filter((fruit) => fruit.username !== e),
      );
    }
  }
  useEffect(() => {
    getcffriends();
  }, []);

  useEffect(() => {
    if (cfshowfriends) {
      setTodisplayusers(codeforcesfriends);
    } else {
      setTodisplayusers(codeforcesUsers);
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
  }, [cfshowfriends, codeforcesfriends, searchfield, codeforcesUsers]);
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

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours().toString().padStart(2, "0");
    var min = a.getMinutes().toString().padStart(2, "0");
    var sec = a.getSeconds().toString().padStart(2, "0");
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }
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
          placeholder="Search Leetcode users..."
          className="w-[40%]"
          onChange={(val) => setSearchfield(val.target.value)}
          type="search"
        />
        <div>
          Friends Only
          <Switch
            className="mx-1 align-middle"
            onCheckedChange={(val) => setCfshowfriends(val)}
          />
        </div>
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
