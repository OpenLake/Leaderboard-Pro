import { makeStyles,withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Avatar } from '@material-ui/core';

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
export const CodeforcesTable = ({ darkmode,codeforcesUsers }) => {
    const StyledTableCell = withStyles({
        root: {
          color: !darkmode?"Black":"White",
        }
      })(TableCell);
    const classes = useStyles();

    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
      }
      
  
    return (
        <div className="codechef" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2vh", paddingLeft: "100%", paddingRight: "100%" }}>
            <div>
                <TableContainer component={Paper}>
                    <Table className={darkmode?classes.table_dark:classes.table} aria-label="codeforces-table">
                        <TableHead>
                            <TableRow style={{backgroundColor:darkmode?"#1F2F98":"#1CA7FC"}}>
                            {/* #1CA7FC */}
                            {/* #1F2F98 */}
                                <StyledTableCell>Avatar</StyledTableCell>
                                <StyledTableCell>Username</StyledTableCell>
                                <StyledTableCell>Rating</StyledTableCell>
                                <StyledTableCell>Max rating</StyledTableCell>
                                <StyledTableCell>Last activity</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {codeforcesUsers.map(cfUser => (
                                <TableRow key={cfUser.id}>
                                    <StyledTableCell>
                                        <Avatar src={cfUser.avatar} alt={`${cfUser.username} avatar`} />
                                        {/* TODO: Lazy load the avatars ? */}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Link style={{fontWeight: "bold",textDecoration:"none",color:darkmode?"#03DAC6":""}} href={`https://codeforces.com/profile/${cfUser.username}`} target="_blank">
                                            {cfUser.username}
                                        </Link>
                                    </StyledTableCell>
                                    <StyledTableCell>{cfUser.rating}</StyledTableCell>
                                    <StyledTableCell>{cfUser.max_rating}</StyledTableCell>
                                    <StyledTableCell>{timeConverter(cfUser.last_activity)}</StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}
