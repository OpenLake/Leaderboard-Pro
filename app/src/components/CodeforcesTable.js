import { makeStyles } from '@material-ui/core/styles';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';


const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});
export const CodeforcesTable = ({ codeforcesUsers }) => {

    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="codeforces-table">
                <TableHead>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Max rating</TableCell>
                        <TableCell>Last activity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {codeforcesUsers.map(cfUser => (
                        <TableRow key={cfUser.id}>
                            <TableCell>{cfUser.username}</TableCell>
                            <TableCell>{cfUser.rating}</TableCell>
                            <TableCell>{cfUser.max_rating}</TableCell>
                            <TableCell>{(new Date(cfUser.last_activity)).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}