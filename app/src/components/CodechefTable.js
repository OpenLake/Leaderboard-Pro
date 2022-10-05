import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Avatar } from '@material-ui/core';

import { ResponsiveLine } from '@nivo/line'



const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});
export const CodechefTable = ({ codechefUsers }) => {

    const classes = useStyles();


    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="codeforces-table">
                <TableHead>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Progress</TableCell>
                        <TableCell>Max rating</TableCell>
                        <TableCell>Last activity</TableCell>
                        <TableCell>Global Rank</TableCell>
                        <TableCell>Country Rank</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {codechefUsers.map(cfUser => (
                        <TableRow key={cfUser.id}>
                            <TableCell>
                                <Link href={`https://codechef.com/users/${cfUser.username}`} target="_blank">
                                    {cfUser.username}
                                </Link>
                            </TableCell>
                            <TableCell>{cfUser.rating}</TableCell>
                            <TableCell>

                                <div style={{ height: 50, width: 100 }}>
                                    <MyResponsiveLine url={`http://localhost:8000/codechef/${cfUser.id}`} />
                                </div>
                            </TableCell>
                            <TableCell>{cfUser.max_rating}</TableCell>
                            <TableCell>{(new Date(cfUser.last_updated)).toLocaleString()}</TableCell>
                            <TableCell>{cfUser.Global_rank}</TableCell>
                            <TableCell>{cfUser.Country_rank}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
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
