import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
} from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    // minWidth: 500,
  },
  table_dark: {
    // minWidth: 500,
    backgroundColor: "Black",
    border: "2px solid White",
    borderRadius: "10px",
  },

  tableCell: {
    padding: "16px", // Adjust the padding as per your requirement
  },
});

const LeetcodeRankingsCCPS = ({ darkmode }) => {
  const [contestId, setContestId] = useState("");
  const [rankings, setRankings] = useState([]);

  const handleContestIdChange = (event) => {
    const selectedContest = event.target.value;
    const convertedContestId = selectedContest
      .replace(/\s/g, "")
      .replace("Contest", "")
      .toLowerCase();

    setContestId(convertedContestId);
  };
  const [contestOptions, setcontestoptions] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "/contest-rankings/"
        );
        const data = response.data;

        const contestRankings = data.map((rank) => ({
          username: rank.usernames,
          ranking: rank[contestId],
        }));

        const columnNames = Object.keys(data[0]);
        columnNames.shift();
        setcontestoptions(columnNames);

        // Sort the rankings based on the contest ranking and whether the ranking is zero or not
        const sortedRankings = contestRankings.sort((a, b) => {
          if (a.ranking === 0 && b.ranking === 0) {
            return 0;
          } else if (a.ranking === 0) {
            return 1;
          } else if (b.ranking === 0) {
            return -1;
          } else {
            return a.ranking - b.ranking;
          }
        });

        setRankings(sortedRankings);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRankings();
  }, [contestId]);

  const classes = useStyles();
  const StyledTableCell = withStyles({
    root: {
      color: !darkmode ? "Black" : "White",
    },
  })(TableCell);

  return (
    <div style={{ maxWidth: "100%" }}>
      <div
        className="codechef"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "9vh",
          width: "99vw",
          flexShrink: "0",
        }}
      >
        <form style={{ textAlign: "center", marginTop: "100px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              color: darkmode ? "white" : "black",
            }}
          >
            Select a Contest
            <Select
              value={contestId}
              onChange={handleContestIdChange}
              style={{
                marginLeft: "15px",
                color: darkmode ? "white" : "black",
                backgroundColor: darkmode ? "#333" : "white",
              }}
            >
              <MenuItem value="" disabled>
                Select a Contest
              </MenuItem>
              {contestOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </label>
        </form>
      </div>

      <div
        className="codechef"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "9vh",
          width: "99vw",
          flexShrink: "0",
        }}
      >
        <div>
          <div style={{ visibility: "hidden", marginRight: "18vw" }}></div>
          <TableContainer component={Paper}>
            <Table
              className={darkmode ? classes.table_dark : classes.table}
              aria-label="codeforces-table"
            >
              <TableHead>
                <TableRow
                  style={{ backgroundColor: darkmode ? "#1c2e4a " : "#1CA7FC" }}
                >
                  <StyledTableCell
                    className={classes.tableCell}
                    style={{ textAlign: "center" }}
                  >
                    Institute Rank
                  </StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    style={{ textAlign: "center" }}
                  >
                    Username
                  </StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                    style={{ textAlign: "center" }}
                  >
                    Rank
                  </StyledTableCell>
                  <StyledTableCell
                    className={classes.tableCell}
                  ></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rankings.length > 0 ? (
                  rankings.map((rank, index) => (
                    <TableRow
                      key={rank.username}
                      style={{
                        marginBottom: "5px",
                        backgroundColor: darkmode ? "black" : "white",
                        color: darkmode ? "white" : "black",
                      }}
                    >
                      <StyledTableCell
                        className={classes.tableCell}
                        style={{ textAlign: "center" }}
                      >
                        {rank.ranking !== 0 ? index + 1 : "N/A"}
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        style={{ textAlign: "center", cursor: "pointer" }}
                      >
                        <Link
                          style={{ textDecoration: "none" }}
                          to={`/leetcoderanking/${rank.username}`}
                        >
                          {rank.username}
                        </Link>
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        style={{ textAlign: "center" }}
                      >
                        {rank.ranking !== null ? rank.ranking : "N/A"}
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                      ></StyledTableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} style={{ textAlign: "center" }}>
                      No rankings available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default LeetcodeRankingsCCPS;
