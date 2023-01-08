import { makeStyles,withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Avatar } from '@material-ui/core';


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


export const GithubTable = ({ darkmode,githubUser }) => {
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
                            <StyledTableCell>Avatar</StyledTableCell>
                                <StyledTableCell >Username</StyledTableCell>
                                <StyledTableCell >Contributions</StyledTableCell>
                                <StyledTableCell >Repositories</StyledTableCell>
                                <StyledTableCell >Stars</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {githubUser.map(glUser => (
                                <TableRow key={glUser.id}>
                                    <StyledTableCell>
                                        <Avatar src={glUser.avatar} alt={`${glUser.username} avatar`} />
                                        {/* TODO: Lazy load the avatars ? */}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                    <Link style={{fontWeight: "bold",textDecoration:"none",color:darkmode?"#03DAC6":""}} href={`https://github.com/${glUser.username}`} target="_blank">
                                        {glUser.username}
                                    </Link>
                                    </StyledTableCell>
                                    <StyledTableCell>{glUser.contributions}</StyledTableCell>
                                    <StyledTableCell>{glUser.repositories}</StyledTableCell>
                                    <StyledTableCell>{glUser.stars}</StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )

}

