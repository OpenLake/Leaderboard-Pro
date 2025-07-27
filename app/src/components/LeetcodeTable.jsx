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

export function LCTable({ leetcodeUsers }) {
  const [searchfield, setSearchfield] = useState("");
  const [filteredusers, setFilteredusers] = useState([]);
  const [todisplayusers, setTodisplayusers] = useState([]);
  const { open, isMobile } = useSidebar();
  const [leetcodefriends, setLeetcodefriends] = useState([]);
  const [LTshowfriends, setLTshowfriends] = useState(false);
  const columns = [
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage src={row.getValue("avatar")} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      ),
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
      accessorKey: "ranking",
      header: "Ranking",
    },
    {
      accessorKey: "easy_solved",
      header: "Easy solved",
    },
    {
      accessorKey: "medium_solved",
      header: "Medium solved",
    },
    {
      accessorKey: "hard_solved",
      header: "Hard solved",
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
            {leetcodefriends.includes(username) ? (
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

  const getltfriends = async () => {
    const response = await fetch(BACKEND + "/leetcodeFL/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          JSON.parse(localStorage.getItem("authTokens")).access,
      },
    });

    const newData = await response.json();
    setLeetcodefriends(newData);
  };

  async function addfriend(e) {
    const response = await fetch(BACKEND + "/leetcodeFA/", {
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
      setLeetcodefriends((current) => [...current, e]);
    }
  }
  async function dropfriend(e) {
    const response = await fetch(BACKEND + "/leetcodeFD/", {
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
      setLeetcodefriends((current) =>
        current.filter((fruit) => fruit.username !== e),
      );
    }
  }
  useEffect(() => {
    getltfriends();
  }, []);

  useEffect(() => {
    if (LTshowfriends) {
      setTodisplayusers(leetcodefriends);
    } else {
      setTodisplayusers(leetcodeUsers);
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
  }, [LTshowfriends, leetcodefriends, searchfield, leetcodeUsers]);
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
          placeholder="Search Leetcode users..."
          className="w-[40%]"
          onChange={(val) => setSearchfield(val.target.value)}
          type="search"
        />
        <div>
          Friends Only
          <Switch
            className="mx-1 align-middle"
            onCheckedChange={(val) => setLTshowfriends(val)}
          />
        </div>
      </div>
      <DataTable
        data={filteredusers.sort((a, b) =>
          a.ranking > b.ranking ? 1 : -1,
        )}
        columns={columns}
      />
    </div>
  );
}
