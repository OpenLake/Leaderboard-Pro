import { useEffect, useState } from 'react'
import { makeStyles,withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Avatar } from '@material-ui/core';

import { ResponsiveLine } from '@nivo/line'



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
        <div className="codechef" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "8px", paddingLeft: "100%", paddingRight: "100%" }}>
            <div>
                <TableContainer component={Paper}>
                    <Table className={darkmode?classes.table_dark:classes.table} aria-label="codeforces-table">
                        <TableHead>
                            <TableRow>
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
                                        <Link href={"https://leetcode.com/"+cfUser.username+"/"} target="_blank">
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

const MyResponsiveLine = ({ url }) => {

    const [ratingUpdates, setRatingUpdates] = useState([]);

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(res => {
                const updates = res["rating_updates"].map(entry => ({ x: entry.rating, y: entry.timestamp }));
                console.log(updates);
                setRatingUpdates([
                    {
                        "id": `data_${url}`,
                        "color": "hsl(28, 70%, 50%)",
                        "data": updates
                    }
                ])
            })
    }, [url])

    return (
        <ResponsiveLine
            data={ratingUpdates}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={null}
            enableGridX={false}
            enableGridY={false}
            enablePoints={false}
            pointSize={10}
            colors={{ scheme: 'category10' }}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            // pointLabelYOffset={-12}
            useMesh={true}
            legends={[]}
        />

    )
}
