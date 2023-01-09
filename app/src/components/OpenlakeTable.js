
import { makeStyles,withStyles } from '@material-ui/core/styles';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@material-ui/core';


const useStyles = makeStyles({
    table: {
        minWidth: 500,
    },
    table_dark:{
        minWidth: 500,
        backgroundColor:"Black",
        border:"2px solid White",
        borderRadius:"10px",
    }
});


export const OpenlakeTable = ({ darkmode,openlakeContributor }) => {
    const classes = useStyles();
    const StyledTableCell = withStyles({
        root: {
          color: !darkmode?"Black":"White",
        }
      })(TableCell);
    return (
        <div className="openlake" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2vh", paddingLeft: "100%", paddingRight: "100%" }}>
            <div>
                <TableContainer component={Paper}>
                    <Table className={darkmode?classes.table_dark:classes.table} aria-label="codeforces-table">
                        <TableHead>
                            <TableRow style={{backgroundColor:darkmode?"#1F2F98":"#1CA7FC"}}>
                                <StyledTableCell style={{ textAlign: 'center' }}>Username</StyledTableCell>
                                <StyledTableCell style={{ textAlign: 'center' }}>Contributions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {openlakeContributor.map(olUser => (
                                <TableRow key={olUser.id}>
                                    <StyledTableCell style={{ textAlign: 'center' }}>
                                        <Link style={{fontWeight: "bold",textDecoration:"none",color:darkmode?"#03DAC6":""}} href={`https://github.com/${olUser.username}`} target="_blank">
                                            {olUser.username}
                                        </Link>
                                    </StyledTableCell>
                                    <StyledTableCell style={{ textAlign: 'center' }}>{olUser.contributions}</StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}



