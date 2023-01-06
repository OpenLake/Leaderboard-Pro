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
export const LeetcodeTable = ({ darkmode }) => {
    const leetcodeUsers=[{"username":"the_detective","status":"success","message":"retrieved","totalSolved":127,"totalQuestions":2524,"easySolved":45,"totalEasy":618,"mediumSolved":60,"totalMedium":1344,"hardSolved":22,"totalHard":562,"acceptanceRate":46.05,"ranking":459049,"contributionPoints":355,"reputation":0,"submissionCalendar":{"1658361600":5,"1660435200":14,"1660608000":2,"1660694400":25,"1660780800":2,"1660867200":8,"1660953600":1,"1661040000":1,"1661126400":4,"1661212800":1,"1661299200":1,"1661472000":3,"1661558400":1,"1661644800":8,"1661731200":2,"1661817600":8,"1661904000":11,"1661990400":1,"1662076800":3,"1662163200":1,"1662249600":4,"1662336000":2,"1662422400":3,"1662508800":2,"1662595200":1,"1662681600":1,"1662768000":1,"1662854400":2,"1662940800":7,"1663027200":2,"1663113600":4,"1663200000":1,"1663286400":1,"1663372800":2,"1663459200":16,"1663545600":4,"1663632000":3,"1663718400":5,"1663804800":1,"1663891200":9,"1663977600":1,"1664064000":1,"1664150400":1,"1664236800":1,"1664323200":1,"1664409600":1,"1664496000":1,"1664582400":9,"1664668800":2,"1664755200":5,"1664841600":6,"1664928000":3,"1665014400":1,"1665100800":6,"1665187200":3,"1665273600":13,"1665360000":2,"1665446400":1,"1665532800":1,"1665619200":1,"1665705600":1,"1665792000":2,"1665878400":1,"1665964800":1,"1666051200":1,"1666137600":1,"1666224000":1,"1666310400":1,"1666396800":4,"1666483200":1,"1666569600":1,"1666656000":1,"1666742400":1,"1666828800":1,"1666915200":5,"1667001600":1,"1667088000":8,"1667174400":2,"1667260800":1,"1667347200":13,"1667433600":1,"1667520000":4,"1667606400":3,"1667692800":10,"1667779200":1,"1668384000":2,"1669852800":1,"1670025600":1}},
{"username":"san18","status":"success","message":"retrieved","totalSolved":453,"totalQuestions":2524,"easySolved":189,"totalEasy":618,"mediumSolved":243,"totalMedium":1344,"hardSolved":21,"totalHard":562,"acceptanceRate":61.73,"ranking":70545,"contributionPoints":1124,"reputation":2,"submissionCalendar":{"1642032000":15,"1642118400":4,"1642636800":2,"1648944000":3,"1649203200":4,"1651795200":8,"1651881600":6,"1651968000":6,"1652054400":9,"1652140800":5,"1652227200":5,"1652313600":10,"1653091200":5,"1653177600":4,"1654819200":24,"1655078400":13,"1655164800":10,"1655424000":3,"1655596800":6,"1655856000":4,"1655942400":7,"1656028800":3,"1656115200":1,"1656201600":1,"1656720000":1,"1656806400":1,"1656892800":2,"1656979200":2,"1657065600":1,"1657411200":1,"1658361600":17,"1658448000":1,"1659398400":2,"1659571200":3,"1659657600":2,"1659744000":2,"1659830400":7,"1659916800":1,"1660003200":1,"1660089600":14,"1660176000":11,"1660262400":5,"1660348800":13,"1660435200":5,"1660521600":1,"1660608000":3,"1660694400":2,"1660780800":6,"1660867200":13,"1660953600":3,"1661040000":3,"1661126400":1,"1661212800":16,"1661299200":3,"1661385600":11,"1661472000":12,"1661558400":21,"1661644800":21,"1661731200":10,"1661817600":11,"1661904000":15,"1661990400":8,"1662076800":4,"1662163200":11,"1662249600":4,"1662336000":4,"1662422400":1,"1662508800":1,"1662595200":4,"1662681600":4,"1662768000":14,"1662854400":14,"1662940800":21,"1663027200":13,"1663113600":8,"1663200000":23,"1663286400":24,"1663372800":16,"1663459200":20,"1663545600":4,"1663632000":12,"1663718400":11,"1663804800":4,"1663891200":20,"1663977600":19,"1664064000":18,"1664150400":41,"1664236800":7,"1664323200":4,"1664409600":1,"1664496000":1,"1664582400":6,"1664668800":6,"1664755200":2,"1664841600":1,"1664928000":1,"1665014400":6,"1665100800":1,"1665187200":7,"1665273600":1,"1665360000":3,"1665446400":1,"1665532800":1,"1665619200":1,"1665705600":1,"1665792000":1,"1665878400":2,"1665964800":2,"1666051200":2,"1666137600":1,"1666224000":1,"1666310400":1,"1666396800":3,"1666483200":8,"1666656000":1,"1666828800":1,"1666915200":1,"1667088000":8,"1667174400":1,"1667260800":2,"1667347200":2,"1667520000":4,"1667606400":2,"1667692800":2,"1667779200":1,"1667865600":1,"1667952000":5,"1668384000":4,"1668556800":6,"1668643200":9,"1668816000":1,"1669075200":1,"1669161600":6,"1669248000":10,"1670630400":8,"1671840000":15,"1671926400":5,"1672012800":8,"1672099200":5,"1672185600":7,"1672272000":7,"1672531200":1,"1672617600":2,"1672704000":1}}];
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
                                    {cfUser.easySolved}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                    {cfUser.mediumSolved}
                                    </StyledTableCell>

                                    <StyledTableCell>
                                        {cfUser.hardSolved}
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
