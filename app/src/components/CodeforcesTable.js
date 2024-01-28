import { makeStyles, withStyles } from "@material-ui/core/styles";
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
} from "@material-ui/core";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";
import useScreenWidth from "../utils/useScreeWidth";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  table_dark: {
    minWidth: 650,
    backgroundColor: "Black",
    border: "2px solid White",
    borderRadius: "10px",
  },
  medium_page: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "column-reverse",
    paddingLeft: "2.5vw",
    paddingRight: "2.5vw",
    marginTop: "9vh",
    width: "100vw",
    flexShrink: "0",
  },
  large_page: {
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    padding: "auto",
    marginTop: "10vh",
    width: "99vw",
    flexShrink: "0",
  },
});

export const CodeforcesTable = ({
  darkmode,
  codeforcesUsers,
  codeforcesfriends,
  setCodeforcesfriends,
  cfshowfriends,
  setCfshowfriends,
}) => {
  const [searchfield, setSearchfield] = useState("");
  const [filteredusers, setFilteredusers] = useState([]);
  const [todisplayusers, setTodisplayusers] = useState([]);
  const getcffriends = async () => {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/codeforcesFL/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
        },
      }
    );
    const newData = await response.json();
    setCodeforcesfriends(newData);
    console.log(newData);
    // setTodisplayusers(codeforcesUsers)
    // setFilteredusers(codeforcesUsers)
  };

  async function addfriend(e) {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/codeforcesFA/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
        },
        body: JSON.stringify({
          friendName: e.username,
        }),
      }
    );
    if (response.status !== 200) {
      alert("ERROR!!!!");
    } else {
      setCodeforcesfriends((current) => [...current, e]);
    }
  }
  async function dropfriend(e) {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/codeforcesFD/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
        },
        body: JSON.stringify({
          friendName: e,
        }),
      }
    );
    if (response.status !== 200) {
      alert("ERROR!!!!");
    } else {
      setCodeforcesfriends((current) =>
        current.filter((fruit) => fruit.username !== e)
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
        })
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
        })
      );
    }
  }, [searchfield, todisplayusers]);
  const StyledTableCell = withStyles({
    root: {
      color: !darkmode ? "Black" : "White",
    },
  })(TableCell);
  const classes = useStyles();

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
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }

  const isMobile = useScreenWidth(786);

  return (
    <div
      className={`codechef ${
        isMobile ? classes.medium_page : classes.large_page
      }`}
    >
      <div
        style={{
          width: "18vw",
          maxWidth: "200px",
          marginBottom: "10px",
        }}
      ></div>
      <div
        style={{
          marginBottom: "1px",
        }}
      >
        <TableContainer component={Paper}>
          <Table
            className={darkmode ? classes.table_dark : classes.table}
            aria-label="codeforces-table"
          >
            <TableHead>
              <TableRow
                style={{ backgroundColor: darkmode ? "#1c2e4a" : "#1CA7FC" }}
              >
                {/* #1CA7FC */}
                {/* #1F2F98 */}
                <StyledTableCell>Avatar</StyledTableCell>
                <StyledTableCell>Username</StyledTableCell>
                <StyledTableCell>Rating</StyledTableCell>
                <StyledTableCell>Max rating</StyledTableCell>
                <StyledTableCell>Last activity</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!filteredusers
                ? "no users"
                : filteredusers
                    .sort((a, b) => (a.rating < b.rating ? 1 : -1))
                    .map((cfUser) => (
                      <TableRow key={cfUser.id}>
                        <StyledTableCell>
                          <Avatar
                            src={cfUser.avatar}
                            alt={`${cfUser.username} avatar`}
                          />
                          {/* TODO: Lazy load the avatars ? */}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Link
                            style={{
                              fontWeight: "bold",
                              textDecoration: "none",
                              color: darkmode ? "#03DAC6" : "",
                            }}
                            href={`https://codeforces.com/profile/${cfUser.username}`}
                            target="_blank"
                          >
                            {cfUser.username}
                          </Link>
                        </StyledTableCell>
                        <StyledTableCell>{cfUser.rating}</StyledTableCell>
                        <StyledTableCell>{cfUser.max_rating}</StyledTableCell>
                        <StyledTableCell>
                          {timeConverter(cfUser.last_activity)}
                        </StyledTableCell>
                        <StyledTableCell>
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: darkmode ? "#146ca4" : "",
                            }}
                            onClick={() => {
                              !codeforcesfriends.some(
                                (item) => item.username === cfUser.username
                              )
                                ? addfriend(cfUser)
                                : dropfriend(cfUser.username);
                            }}
                          >
                            {codeforcesfriends.some(
                              (item) => item.username === cfUser.username
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
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "2vh",
          position: "relative",
          marginBottom: "10px",
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
          selected={cfshowfriends}
          onChange={() => {
            setCfshowfriends(!cfshowfriends);
          }}
          style={{
            backgroundColor: darkmode ? "#02055a" : "#2196f3",
            color: "white",
            marginTop: isMobile ? "2vh" : "4vh",
          }}
        >
          {cfshowfriends ? "Show All" : "Show Friends"}
        </ToggleButton>
      </div>
    </div>
  );
};
