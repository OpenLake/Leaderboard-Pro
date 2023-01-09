import { makeStyles,withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useEffect, useState } from 'react';
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


export const OpenlakeTable = ({ darkmode,openlakeContributor }) => {
    const [searchfield,setSearchfield]=useState("")
    const [filteredusers,setFilteredusers]=useState([])
useEffect(() => {
    if(searchfield === "")
    {
        // eslint-disable-next-line
        setFilteredusers(openlakeContributor)
    }
    else
    {
        // eslint-disable-next-line
        setFilteredusers(openlakeContributor.filter(
            cfUser => {
              return (
                cfUser
                .username
                .toLowerCase()
                .includes(searchfield.toLowerCase())
              );
            }
        ))
    }
    // eslint-disable-next-line
  },[searchfield,]);
    const classes = useStyles();
    const StyledTableCell = withStyles({
        root: {
          color: !darkmode?"Black":"White",
        }
      })(TableCell);
    return (
        <div className="codechef" style={{ display: "flex", justifyContent: "space-between",  marginTop: "2vh",width:"100vw",flexShrink:"0"}}>
            <div style={{visibility:"hidden",marginRight:"18vw"}}>
                </div>
            <div>
                <TableContainer component={Paper}>
                    <Table className={darkmode?classes.table_dark:classes.table} aria-label="codeforces-table">
                        <TableHead>
                            <TableRow style={{backgroundColor:darkmode?"#1F2F98":"#1CA7FC"}}>
                                <StyledTableCell style={{ textAlign: 'center' }}>Username</StyledTableCell>
                                <StyledTableCell style={{ textAlign: 'center' }}>Contributions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredusers.map(olUser => (
                                <TableRow key={olUser.id}>
                                    <StyledTableCell style={{ textAlign: 'center' }}>
                                        <Link style={{fontWeight: "bold",textDecoration:"none",color:darkmode?"#03DAC6":""}} href={`https://github.com/${olUser.username}`} target="_blank">
                                            {olUser.username}
                                        </Link>
                                    </StyledTableCell>
                                    <StyledTableCell style={{ textAlign: 'center' }}>{olUser.contributions}</StyledTableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div style={{marginRight:"3vw",marginTop:"2vh",position:"relative"}}>   
            <TextField id="outlined-basic" label="Search Usernames" variant="outlined" 
            defaultValue=""
            InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              onChange={(e)=>{setSearchfield(e.target.value)}}
    
            />
            </div>
        </div>
    )
}



