import React, { useState, useEffect } from "react";
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
  Link,
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
  //   container: {
  //     // marginLeft: "auto",
  //     // marginRight: "auto",
  //     // maxWidth: "90%",
  //     marginTop: "100px",
  //   },
  tableCell: {
    padding: "16px", // Adjust the padding as per your requirement
  },
  //   mobileContainer: {
  //     minWidth: "100%",
  //     // overflowX: "auto",
  //     marginTop: "50px",
  //   },
});

const LeetcodeRankingsCCPS = ({ darkmode }) => {
  const [contestId, setContestId] = useState("");
  const [rankings, setRankings] = useState([]);

  const handleContestIdChange = (event) => {
    setContestId(event.target.value);
  };

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/contest-rankings/",
          {
            params: {
              contest: contestId,
            },
          }
        );
        const data = response.data;
        setRankings(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (contestId) {
      fetchRankings();
    }
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
              value={contestId} // Set the default value to "Weekly Contest 347"
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
              <MenuItem value="Weekly Contest 347">Weekly Contest 347</MenuItem>
              <MenuItem value="Weekly Contest 348">Weekly Contest 348</MenuItem>
              <MenuItem value="Biweekly Contest 105">
                Biweekly Contest 105
              </MenuItem>
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
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.tableCell}
                        style={{ textAlign: "center" }}
                      >
                        {rank.username}
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

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const LeetcodeRankingsCCPS = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios.get('http://localhost:8000/contest-rankings/')
//       .then(response => {
//         setData(response.data);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }, []);

//   return (
//     <div>
//       {/* {data.map(contest => (
//         <div key={contest.id}>
//           <h2>{contest.name}</h2>
//           <ul>
//             {contest.contestant__username.map((username, index) => (
//               <li key={index}>
//                 {username} - Ranking: {contest.contestant__ranking[index]}
//               </li>
//             ))}
//           </ul>
//         </div> */}
//         {data.map((row, index) => (
//           <div key={index}
//           style={{
//             marginBottom: '5px',
//             backgroundColor: darkmode ? 'black' : 'white',
//             color: darkmode ? 'white' : 'black',
//           }}>
//             <td>{row[0]}</td> {/* Username */}
//             <td>{row[1].join(', ')}</td> {/* Rankings */}
//           </div>

//         ))}

//     </div>
//   );
// };

// export default LeetcodeRankingsCCPS;
