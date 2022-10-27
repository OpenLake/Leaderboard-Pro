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
                        {/* <TableBody>
                {githubUser.map(glUser => (
                    <TableRow key={glUser.id}>
                        <TableCell>{glUser.Contributor}</TableCell>
                        <TableCell>{glUser.Contriution}</TableCell>
                    </TableRow>
                ))}
            </TableBody> */}
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
