import { makeStyles } from '@material-ui/core/styles';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Avatar } from '@material-ui/core';


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
                        <TableCell>Avatar</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Max rating</TableCell>
                        <TableCell>Last activity</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {codeforcesUsers.map(cfUser => (
                        <TableRow key={cfUser.id}>
                            <TableCell>
                                <Avatar src={cfUser.avatar} alt={`${cfUser.username} avatar`} />
                                {/* TODO: Lazy load the avatars ? */}
                            </TableCell>
                            <TableCell>
                                <Link href={`https://codeforces.com/profile/${cfUser.username}`} target="_blank">
                                    {cfUser.username}
                                </Link>
                            </TableCell>
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