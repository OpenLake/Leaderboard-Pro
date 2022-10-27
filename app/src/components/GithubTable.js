import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@material-ui/core';

import { ResponsiveLine } from '@nivo/line'

const useStyles = makeStyles({
    table: {
        minWidth: 500,
    },
});


export const GithubTable = ({ githubUser }) => {
    const classes = useStyles();

    return (
        <div className="openlake" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "8px", paddingLeft: "100%", paddingRight: "100%" }}>
            <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="codeforces-table">
                        <TableHead>
                            <TableRow>
                                <TableCell >Username</TableCell>
                                <TableCell >Contributions</TableCell>
                                <TableCell >Repositories</TableCell>
                                <TableCell >Stars</TableCell>
                                <TableCell >Last_updated</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {githubUser.map(glUser => (
                                <TableRow key={glUser.id}>
                                    <TableCell>{glUser.username}</TableCell>
                                    <TableCell>{glUser.contributions}</TableCell>
                                    <TableCell>{glUser.repositories}</TableCell>
                                    <TableCell>{glUser.stars}</TableCell>
                                    <TableCell>{glUser.last_updated}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )

}

