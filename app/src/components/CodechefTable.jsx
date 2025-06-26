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

export const CodechefTable = ({
  darkmode,
  codechefUsers,
  codecheffriends,
  setCodecheffriends,
  ccshowfriends,
  setCCshowfriends,
}) => {
  const [searchfield, setSearchfield] = useState("");
  const [filteredusers, setFilteredusers] = useState([]);
  const [todisplayusers, setTodisplayusers] = useState([]);
  const getccfriends = async () => {
    const response = await fetch("http://127.0.0.1:8000/codechefFL/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
      },
    });

    const newData = await response.json();
    setCodecheffriends(newData);
  };

  async function addfriend(e) {
    const response = await fetch("http://127.0.0.1:8000/codechefFA/", {
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
      console.log(response);
      setCodecheffriends((current) => [...current, e]);
    }
  }
  async function dropfriend(e) {
    const response = await fetch("http://127.0.0.1:8000/codechefFD/", {
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
      setCodecheffriends((current) =>
        current.filter((fruit) => fruit.username !== e),
      );
    }
  }
  useEffect(() => {
    getccfriends();
    // eslint-disable-next-line
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
      // eslint-disable-next-line
      setFilteredusers(
        todisplayusers.filter((ccUser) => {
          return ccUser.username
            .toLowerCase()
            .includes(searchfield.toLowerCase());
        }),
      );
    }
    // eslint-disable-next-line
  }, [ccshowfriends, codecheffriends, searchfield, codechefUsers]);
  useEffect(() => {
    if (searchfield === "") {
      setFilteredusers(todisplayusers);
    } else {
      // eslint-disable-next-line
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
                                (item) => item.username === ccUser.username,
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
