
import { makeStyles,withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@material-ui/core';




const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    table_dark:{
        minWidth: 650,
        backgroundColor:"Black",
        border:"2px solid White",
        borderRadius:"10px",
    }
});
export const LeetcodeTable = ({ darkmode,leetcodeUsers }) => {
   const StyledTableCell = withStyles({
        root: {
          color: !darkmode?"Black":"White",
        }
      })(TableCell);
    const classes = useStyles();


    return (
        <div className="codechef" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2vh", paddingLeft: "100%", paddingRight: "100%" }}>
            <div>
                <TableContainer component={Paper}>
                    <Table className={darkmode?classes.table_dark:classes.table} aria-label="codeforces-table">
                        <TableHead>
                            <TableRow style={{backgroundColor:darkmode?"#1F2F98":"#1CA7FC"}}>
                                <StyledTableCell>Username</StyledTableCell>
                                <StyledTableCell>Ranking</StyledTableCell>
                                <StyledTableCell>Easy Solved</StyledTableCell>
                                <StyledTableCell>Medium Solved</StyledTableCell>
                                <StyledTableCell>Hard Solved</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leetcodeUsers.map(cfUser => (
                                <TableRow key={cfUser.id}>
                                    <StyledTableCell>
                                        <Link style={{fontWeight: "bold",textDecoration:"none",color:darkmode?"#03DAC6":""}} href={"https://leetcode.com/"+cfUser.username+"/"} target="_blank">
                                        {cfUser.username}
                                        </Link>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                    {cfUser.ranking}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                    {cfUser.easy_solved}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                    {cfUser.medium_solved}
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        {cfUser.hard_solved}
                                    </StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}
