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
import useScreenWidth from "../hooks/useScreeWidth";

const PREFIX = "LeetcodeTable";

const classes = {
  root: `${PREFIX}-root`,
  table: `${PREFIX}-table`,
  table_dark: `${PREFIX}-table_dark`,
  medium_page: `${PREFIX}-medium_page`,
  large_page: `${PREFIX}-large_page`,
};

const Root = styled("div")({
  [`& .${classes.table}`]: {
    minWidth: 650,
  },
  [`& .${classes.table_dark}`]: {
    minWidth: 650,
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
const BACKEND = import.meta.env.VITE_BACKEND

export const LeetcodeTable = ({
  darkmode,
  leetcodeUsers,
  leetcodefriends,
  setLeetcodefriends,
  ltshowfriends,
  setLTshowfriends,
}) => {
  const [searchfield, setSearchfield] = useState("");
  const [filteredusers, setFilteredusers] = useState([]);
  const [todisplayusers, setTodisplayusers] = useState([]);
  const getltfriends = async () => {
    const response = await fetch(BACKEND + "/leetcodeFL/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
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
          "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
      },
      body: JSON.stringify({
        friendName: e.username,
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
          "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (ltshowfriends) {
      setTodisplayusers(leetcodefriends);
    } else {
      setTodisplayusers(leetcodeUsers);
    }
    if (searchfield === "") {
      setFilteredusers(todisplayusers);
    } else {
      // eslint-disable-next-line
      setFilteredusers(
        todisplayusers.filter((cfUser) => {
          return cfUser.username
            .toLowerCase()
            .includes(searchfield.toLowerCase());
        }),
      );
    }
    // eslint-disable-next-line
  }, [ltshowfriends, leetcodefriends, searchfield, leetcodeUsers]);
  useEffect(() => {
    if (searchfield === "") {
      setFilteredusers(todisplayusers);
    } else {
      // eslint-disable-next-line
      setFilteredusers(
        todisplayusers.filter((cfUser) => {
          return cfUser.username
            .toLowerCase()
            .includes(searchfield.toLowerCase());
        }),
      );
    }
  }, [searchfield, todisplayusers]);
  const StyledTableCell = TableCell;

  const isMobile = useScreenWidth(786);

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
          width: "100vw",
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
          selected={ltshowfriends}
          onChange={() => {
            setLTshowfriends(!ltshowfriends);
          }}
          style={{
            backgroundColor: darkmode ? "#02055a" : "#2196f3",
            color: "white",
            marginTop: isMobile ? "2vh" : "4vh",
          }}
        >
          {ltshowfriends ? "Show All" : "Show Friends"}
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
                aria-label="leetcode-table"
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
                      Ranking
                    </StyledTableCell>
                    <StyledTableCell
                      classes={{
                        root: classes.root,
                      }}
                    >
                      Easy Solved
                    </StyledTableCell>
                    <StyledTableCell
                      classes={{
                        root: classes.root,
                      }}
                    >
                      Medium Solved
                    </StyledTableCell>
                    <StyledTableCell
                      classes={{
                        root: classes.root,
                      }}
                    >
                      Hard Solved
                    </StyledTableCell>
                    <StyledTableCell
                      classes={{
                        root: classes.root,
                      }}
                    >
                      Total Solved
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
                    .sort((a, b) => (a.ranking > b.ranking ? 1 : -1))
                    .map((ltUser) => (
                      <TableRow key={ltUser.id}>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          <Avatar
                            src={ltUser.avatar}
                            alt={`${ltUser.username} avatar`}
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
                            href={
                              "https://leetcode.com/" + ltUser.username + "/"
                            }
                            target="_blank"
                          >
                            {ltUser.username}
                          </Link>
                        </StyledTableCell>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          {ltUser.ranking}
                        </StyledTableCell>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          {ltUser.easy_solved}
                        </StyledTableCell>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          {ltUser.medium_solved}
                        </StyledTableCell>

                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          {ltUser.hard_solved}
                        </StyledTableCell>
                        <StyledTableCell
                          classes={{
                            root: classes.root,
                          }}
                        >
                          {ltUser.total_solved}
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
                              !leetcodefriends.some(
                                (item) => item.username === ltUser.username,
                              )
                                ? addfriend(ltUser)
                                : dropfriend(ltUser.username);
                            }}
                          >
                            {leetcodefriends.some(
                              (item) => item.username === ltUser.username,
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
