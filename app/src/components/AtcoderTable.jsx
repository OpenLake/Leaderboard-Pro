import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { DataTable } from "./ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { User } from "lucide-react";

const BACKEND = import.meta.env.VITE_BACKEND;

export function AtcoderTable({ atcoderUsers }) {
  const { open, isMobile } = useSidebar();
  const [searchfield, setSearchfield] = useState("");
  const [filteredusers, setFilteredusers] = useState([]);
  const [newUsername, setNewUsername] = useState("");

  const columns = [
    {
      accessorKey: "rank",
      header: "Rank",
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const username = row.getValue("username");
        return (
          <Button variant="link" asChild>
            <a
              href={`https://atcoder.jp/users/${username}`}
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
      accessorKey: "highest_rating",
      header: "Highest Rating",
    },
  ];

  /* 
     Since backend 'friends' logic for AtCoder is not implemented yet,
     we skip the friends filter and add/remove friend logic.
  */

  useEffect(() => {
     setFilteredusers(atcoderUsers);
  }, [atcoderUsers]);


  useEffect(() => {
    if (searchfield === "") {
      setFilteredusers(atcoderUsers);
    } else {
      setFilteredusers(
        atcoderUsers.filter((user) => {
          return user.username
            .toLowerCase()
            .includes(searchfield.toLowerCase());
        }),
      );
    }
  }, [searchfield, atcoderUsers]);

  const handleAddUser = async () => {
    if (!newUsername) return;
    try {
      const authTokens = localStorage.getItem("authTokens") 
        ? JSON.parse(localStorage.getItem("authTokens")) 
        : null;

      if (!authTokens || !authTokens.access) {
          alert("You must be logged in to add a user.");
          return;
      }

      const response = await fetch(BACKEND + "/atcoder/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authTokens.access,
        },
        body: JSON.stringify({ username: newUsername }),
      });
      if (response.ok) {
        alert("User added! Please refresh or wait for update.");
        setNewUsername("");
        // Optionally trigger a refresh of users from parent or reload page
        window.location.reload(); 
      } else {
        alert("Failed to add user.");
      }
    } catch (e) {
      console.error(e);
      alert("Error adding user.");
    }
  };

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
      <div className="mb-2 flex flex-col gap-2 md:flex-row md:justify-between">
        <Input
          placeholder="Search AtCoder users..."
          className="w-[40%]"
          onChange={(val) => setSearchfield(val.target.value)}
          type="search"
        />
         <div className="flex gap-2">
            <Input 
                placeholder="Add Username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
            />
            <Button onClick={handleAddUser}>Add User</Button>
         </div>
      </div>
      <DataTable
        data={[...filteredusers].sort((a, b) => (a.rating < b.rating ? 1 : -1))}
        columns={columns}
      />
    </div>
  );
}
