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
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/leetcodeFL/",
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
    setLeetcodefriends(newData);
    // setTodisplayusers(leetcodeUsers)
    // setFilteredusers(leetcodeUsers)
  };

  async function addfriend(e) {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/leetcodeFA/",
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
      setLeetcodefriends((current) => [...current, e]);
    }
  }
  async function dropfriend(e) {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/leetcodeFD/",
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
      setLeetcodefriends((current) =>
        current.filter((fruit) => fruit.username !== e)
      );
    }
  }
  useEffect(() => {
    getltfriends();
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
      setFilteredusers(
        todisplayusers.filter((cfUser) => {
          return cfUser.username
            .toLowerCase()
            .includes(searchfield.toLowerCase());
        })
      );
    }
  }, [ltshowfriends, leetcodefriends, searchfield, leetcodeUsers]);
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
      ></div>{" "}
      <div
        style={{
          marginBottom: "1px",
        }}
      >
        <TableContainer component={Paper}>
          <Table
            className={darkmode ? classes.table_dark : classes.table}
            aria-label="leetcode-table"
          >
            <TableHead>
              <TableRow
                style={{ backgroundColor: darkmode ? "#1c2e4a" : "#1CA7FC" }}
              >
                <StyledTableCell>Avatar</StyledTableCell>
                <StyledTableCell>Username</StyledTableCell>
                <StyledTableCell>Ranking</StyledTableCell>
                <StyledTableCell>Easy Solved</StyledTableCell>
                <StyledTableCell>Medium Solved</StyledTableCell>
                <StyledTableCell>Hard Solved</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredusers
                .sort((a, b) => (a.ranking > b.ranking ? 1 : -1))
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
                        href={"https://leetcode.com/" + cfUser.username + "/"}
                        target="_blank"
                      >
                        {cfUser.username}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell>{cfUser.ranking}</StyledTableCell>
                    <StyledTableCell>{cfUser.easy_solved}</StyledTableCell>
                    <StyledTableCell>{cfUser.medium_solved}</StyledTableCell>

                    <StyledTableCell>{cfUser.hard_solved}</StyledTableCell>
                    <StyledTableCell>
                      <Button
                        variant="contained"
                        style={{ backgroundColor: darkmode ? "#146ca4" : "" }}
                        onClick={() => {
                          !leetcodefriends.some(
                            (item) => item.username === cfUser.username
                          )
                            ? addfriend(cfUser)
                            : dropfriend(cfUser.username);
                        }}
                      >
                        {leetcodefriends.some(
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
      </div>
    </div>
  );
};
