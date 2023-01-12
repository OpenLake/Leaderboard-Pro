import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from '@mui/material/Button';
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
import { useEffect, useState} from "react";
import ToggleButton from "@mui/material/ToggleButton";
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
});

export const CodeforcesTable = ({darkmode,
   codeforcesUsers,codeforcesfriends,setCodeforcesfriends,
   cfshowfriends,setCfshowfriends}) => {
  const [searchfield, setSearchfield] = useState("");
  const [cffilteredusers, setCffilteredusers] = useState([]);
  const [todisplayusers, setTodisplayusers] = useState([]);
  const getcffriends= async ()=>{
    const response=await fetch("http://localhost:8000/api/getcffriends/",{
      method:'GET',
      headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer '+JSON.parse(localStorage.getItem('authTokens')).access,
      },
  });
    const newData=await response.json();
    setCodeforcesfriends(newData);
    // setTodisplayusers(codeforcesUsers)
    // setCffilteredusers(codeforcesUsers)
  }

  useEffect(()=>{
    getcffriends();
    // eslint-disable-next-line
  },[])

  useEffect(()=>{
    if(cfshowfriends)
    {
      setTodisplayusers(codeforcesfriends);
    }
    else
    {
      setTodisplayusers(codeforcesUsers);
    }
    if (searchfield === "") {
      setCffilteredusers(todisplayusers)
    } else {
      // eslint-disable-next-line
      setCffilteredusers(
        todisplayusers.filter((cfUser) => {
          return cfUser.username
            .toLowerCase()
            .includes(searchfield.toLowerCase());
        })
      );
    }
    // eslint-disable-next-line
  },[cfshowfriends,codeforcesfriends,searchfield,codeforcesUsers])
useEffect(()=>{
  if (searchfield === "") {
    setCffilteredusers(todisplayusers)
  } else {
    // eslint-disable-next-line
    setCffilteredusers(
      todisplayusers.filter((cfUser) => {
        return cfUser.username
          .toLowerCase()
          .includes(searchfield.toLowerCase());
      })
    );
  }
},[searchfield,todisplayusers])
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
      <div style={{ marginRight: "18vw" }}></div>
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
              {!cffilteredusers?"no users":cffilteredusers.map((cfUser) => (
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
                  <Button variant="contained">
                    {
                      (codeforcesfriends.some(item=>item.username===cfUser.username))?
                      "Remove Friend":"Add Friend"
                    }

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
          selected={cfshowfriends}
          onChange={() => {
            setCfshowfriends(!cfshowfriends)
          }}
          style={{
            backgroundColor: "#2196f3",
            color: "white",
            marginTop: "4vh",
          }}
        >
          {cfshowfriends?"Show All":"Show Friends"}
        </ToggleButton>
      </div>
    </div>
  );
};
