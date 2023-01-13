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
} from "@material-ui/core";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";
const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  table_dark: {
    minWidth: 500,
    backgroundColor: "Black",
    border: "2px solid White",
    borderRadius: "10px",
  },
});

export const OpenlakeTable = ({
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
      const response = await fetch("http://localhost:8000/api/getolfriends/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
        },
      });
  
      const newData = await response.json();
      setCodecheffriends(newData);
      // setTodisplayusers(codeforcesUsers)
      // setFilteredusers(codeforcesUsers)
    };
  
    async function addfriend(e) {
      
      const response = await fetch("http://localhost:8000/api/olfriends/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
        },
        body: JSON.stringify({
          olFriend_uname: e.username,
        }),
      });
      if (response.status !== 200) {
        alert("ERROR!!!!");
      }
      else
      {
        setCodecheffriends((current) => [...current, e]);
      }
    }
    async function dropfriend(e) {
      
      const response = await fetch("http://localhost:8000/api/dropolfriends/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
        },
        body: JSON.stringify({
          olFriend_uname: e,
        }),
      });
      if (response.status !== 200) {
        alert("ERROR!!!!");
      }
      else
      {
        setCodecheffriends((current) =>
        current.filter((fruit) => fruit.username !== e)
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
          todisplayusers.filter((cfUser) => {
            return cfUser.username
              .toLowerCase()
              .includes(searchfield.toLowerCase());
          })
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
          todisplayusers.filter((cfUser) => {
            return cfUser.username
              .toLowerCase()
              .includes(searchfield.toLowerCase());
          })
        );
      }
    }, [searchfield, todisplayusers]);
  const classes = useStyles();
  const StyledTableCell = withStyles({
    root: {
      color: !darkmode ? "Black" : "White",
    },
  })(TableCell);
  return (
    <div
      className="codechef"
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginTop: "2vh",
        width: "100vw",
        flexShrink: "0",
      }}
    >
      <div style={{ visibility: "hidden", marginRight: "18vw" }}></div>
      <div>
        <TableContainer component={Paper}>
          <Table
            className={darkmode ? classes.table_dark : classes.table}
            aria-label="codeforces-table"
          >
            <TableHead>
              <TableRow
                style={{ backgroundColor: darkmode ? "#1F2F98" : "#1CA7FC" }}
              >
                <StyledTableCell style={{ textAlign: "center" }}>
                  Username
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center" }}>
                  Contributions
                </StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredusers.sort((a, b) => (a.contributions < b.contributions ? 1 : -1)).map((olUser) => (
                <TableRow key={olUser.id}>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    <Link
                      style={{
                        fontWeight: "bold",
                        textDecoration: "none",
                        color: darkmode ? "#03DAC6" : "",
                      }}
                      href={`https://github.com/${olUser.username}`}
                      target="_blank"
                    >
                      {olUser.username}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    {olUser.contributions}
                  </StyledTableCell>
                  <StyledTableCell>
                      <Button
                        variant="contained"
                        onClick={() => {
                          !codecheffriends.some(
                            (item) => item.username === olUser.username
                          )
                            ? addfriend(olUser)
                            : dropfriend(olUser.username);
                        }}
                      >
                        {codecheffriends.some(
                          (item) => item.username === olUser.username
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
          marginRight: "5vw",
          marginTop: "2vh",
          position: "relative",
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
            backgroundColor: "#2196f3",
            color: "white",
            marginTop: "4vh",
          }}
        >
          {ccshowfriends ? "Show All" : "Show Friends"}
        </ToggleButton>
      </div>
    </div>
  );
};
