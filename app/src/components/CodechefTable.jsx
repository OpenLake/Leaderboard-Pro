import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  Avatar,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";
import { useSidebar } from "@/components/ui/sidebar";
import { Button as NewButton } from "./ui/button";
import { DataTable } from "./ui/data-table";
import { Input } from "@/components/ui/input";
import { Switch } from "./ui/switch";
import {
  Avatar as NewAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { User } from "lucide-react";

const PREFIX = "CodechefTable";

const classes = {
  root: `${PREFIX}-root`,
  table: `${PREFIX}-table`,
  table_dark: `${PREFIX}-table_dark`,
  medium_page: `${PREFIX}-medium_page`,
  large_page: `${PREFIX}-large_page`,
};

const Root = styled("div")({
  [`& .${classes.table}`]: {
    minWidth: 700,
  },
  [`& .${classes.table_dark}`]: {
    minWidth: 700,
    backgroundColor: "Black",
    border: "2px solid White",
    borderRadius: "10px",
  },
  [`& .${classes.medium_page}`]: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "column-reverse",
    paddingLeft: "2.5vw",
    paddingRight: "2.5vw",
    marginTop: "9vh",
    width: "100vw",
    flexShrink: "0",
  },
  [`& .${classes.large_page}`]: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    padding: "auto",
    marginTop: "10vh",
    width: "99vw",
    flexShrink: "0",
  },
});
const BACKEND = import.meta.env.VITE_BACKEND;
export function CCTable({ codechefUsers }) {
  const { open, isMobile } = useSidebar();
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
          <NewAvatar>
            <AvatarImage src={row.getValue("avatar")} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </NewAvatar>
        );
      },
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const username = row.getValue("username");
        return (
          <NewButton variant="link" asChild>
            <a
              href={`https://codeforces.com/profile/${username}`}
              target="_blank"
              rel="noreferrer"
            >
              {username}
            </a>
          </NewButton>
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
    {
      id: "actions",
      cell: ({ row }) => {
        const username = row.getValue("username");
        return (
          <div className="flex justify-end">
            {codecheffriends.includes(username) ? (
              <NewButton
                variant="outline"
                onClick={() => dropfriend(username)}
              >
                Remove Friend
              </NewButton>
            ) : (
              <NewButton
                variant="secondary"
                onClick={() => addfriend(username)}
              >
                Add Friend
              </NewButton>
            )}
          </div>
        );
      },
    },
  ];
  const getccfriends = async () => {
    const response = await fetch(BACKEND + "/codechefFL/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          JSON.parse(localStorage.getItem("authTokens")).access,
      },
    });

    const newData = await response.json();
    setCodecheffriends(newData);
  };

  async function addfriend(e) {
    const response = await fetch(BACKEND + "/codechefFA/", {
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
      console.log(response);
      setCodecheffriends((current) => [...current, e]);
    }
  }
  async function dropfriend(e) {
    const response = await fetch(BACKEND + "/codechefFD/", {
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
      setCodecheffriends((current) =>
        current.filter((fruit) => fruit.username !== e),
      );
    }
  }
  useEffect(() => {
    getccfriends();
  }, []);

  useEffect(() => {
    if (ccshowfriends) {
      setTodisplayusers(codecheffriends);
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
          placeholder="Search Leetcode users..."
          className="w-[40%]"
          onChange={(val) => setSearchfield(val.target.value)}
          type="search"
        />
        <div>
          Friends Only
          <Switch
            className="mx-1 align-middle"
            onCheckedChange={(val) => setCCshowfriends(val)}
          />
        </div>
      </div>
      <DataTable
        data={filteredusers.sort((a, b) => (a.rating < b.rating ? 1 : -1))}
        columns={columns}
      />
    </div>
  );
}
export const CodechefTable = ({
  darkmode,
  codechefUsers,
  codecheffriends,
  setCodecheffriends,
  ccshowfriends,
  setCCshowfriends,
}) => {
  const { open, isMobile } = useSidebar();
  const [searchfield, setSearchfield] = useState("");
  const [filteredusers, setFilteredusers] = useState([]);
  const [todisplayusers, setTodisplayusers] = useState([]);
  const getccfriends = async () => {
    const response = await fetch(BACKEND + "/codechefFL/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          JSON.parse(localStorage.getItem("authTokens")).access,
      },
    });

    const newData = await response.json();
    setCodecheffriends(newData);
  };

  async function addfriend(e) {
    const response = await fetch(BACKEND + "/codechefFA/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " +
          JSON.parse(localStorage.getItem("authTokens")).access,
      },
      body: JSON.stringify({
        friendName: e.username,
      }),
    });
    if (response.status !== 200) {
      alert("ERROR!!!!");
    } else {
      console.log(response);
      setCodecheffriends((current) => [...current, e]);
    }
  }
  async function dropfriend(e) {
    const response = await fetch(BACKEND + "/codechefFD/", {
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
      setCodecheffriends((current) =>
        current.filter((fruit) => fruit.username !== e),
      );
    }
  }
  useEffect(() => {
    getccfriends();
  }, []);

  useEffect(() => {
    if (ccshowfriends) {
      setTodisplayusers(codecheffriends);
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
  const StyledTableCell = TableCell;

  return (
    <Root
      className={`codechef ${isMobile ? classes.medium_page : classes.large_page}`}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "15vh",
          position: "relative",
          marginBottom: "10px",
          alignItems: "center",
          width:
            open && !isMobile
              ? "calc(100vw - var(--sidebar-width))"
              : "100vw",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Search Usernames"
          variant="outlined"
          defaultValue=""
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setSearchfield(e.target.value);
          }}
        />
        <ToggleButton
          value="check"
          selected={ccshowfriends}
          onChange={() => {
            setCCshowfriends(!ccshowfriends);
          }}
          style={{
            color: "white",
            marginTop: isMobile ? "2vh" : "4vh",
            backgroundColor: darkmode ? "#02055a" : "#2196f3",
          }}
        >
          {ccshowfriends ? "Show All" : "Show Friends"}
        </ToggleButton>
        <div
          style={{
            marginTop: isMobile ? "2vh" : "4vh",
          }}
        >
          {!filteredusers.length ? (
            "No users"
          ) : (
            <TableContainer component={Paper}>
              <Table
                className={darkmode ? classes.table_dark : classes.table}
                aria-label="codeforces-table"
              >
                <TableHead>
                  <TableRow
                    style={{
                      backgroundColor: darkmode ? "#1c2e4a" : "#1CA7FC",
                    }}
                  >
                    <StyledTableCell
                      classes={{
                        root: classes.root,
                      }}
                    >
                      Avatar
                    </StyledTableCell>
                    <StyledTableCell
                      classes={{
                        root: classes.root,
                      }}
                    >
                      Username
                    </StyledTableCell>
                    <StyledTableCell
                      classes={{
                        root: classes.root,
                      }}
                    >
                      Rating
                    </StyledTableCell>
                    <StyledTableCell
                      classes={{
                        root: classes.root,
                      }}
                    >
                      Max rating
                    </StyledTableCell>
                    <StyledTableCell
                      classes={{
                        root: classes.root,
                      }}
                    >
                      Global Rank
                    </StyledTableCell>
                    <StyledTableCell
                      classes={{
                        root: classes.root,
                      }}
                    >
                      Country Rank
                    </StyledTableCell>
                    <StyledTableCell
                      classes={{
                        root: classes.root,
                      }}
                    ></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredusers
                    .sort((a, b) => (a.rating < b.rating ? 1 : -1))
                    .map((ccUser) => (
                      <TableRow key={ccUser.id}>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          <Avatar
                            src={ccUser.avatar}
                            alt={`${ccUser.username} avatar`}
                          />
                          {/* TODO: Lazy load the avatars ? */}
                        </StyledTableCell>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          <Link
                            style={{
                              fontWeight: "bold",
                              textDecoration: "none",
                              color: darkmode ? "#03DAC6" : "",
                            }}
                            href={`https://codechef.com/users/${ccUser.username}`}
                            target="_blank"
                          >
                            {ccUser.username}
                          </Link>
                        </StyledTableCell>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          {ccUser.rating}
                        </StyledTableCell>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          {ccUser.max_rating}
                        </StyledTableCell>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          {ccUser.Global_rank}
                        </StyledTableCell>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          {ccUser.Country_rank}
                        </StyledTableCell>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: darkmode ? "#146ca4" : "",
                            }}
                            onClick={() => {
                              !codecheffriends.some(
                                (item) =>
                                  item.username === ccUser.username,
                              )
                                ? addfriend(ccUser)
                                : dropfriend(ccUser.username);
                            }}
                          >
                            {codecheffriends.some(
                              (item) => item.username === ccUser.username,
                            )
                              ? "Remove Friend"
                              : "Add Friend"}
                          </Button>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </Root>
  );
};
