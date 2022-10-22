import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@material-ui/core';

import { ResponsiveLine } from '@nivo/line'

const useStyles = makeStyles({
    table: {
        minWidth: 500,
    },
});


export const OpenlakeTable = ({ openlakeContributor }) => {
    const classes = useStyles();
    return (
        <div className="openlake" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "8px", paddingLeft: "100%", paddingRight: "100%" }}>
            <div>
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="codeforces-table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>Username</TableCell>
                                <TableCell style={{ textAlign: 'center' }}>Contributions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {openlakeContributor.map(olUser => (
                                <TableRow key={olUser.id}>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        <Link href={`https://github.com/${olUser.username}`} target="_blank">
                                            {olUser.username}
                                        </Link>
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>{olUser.contributions}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}



