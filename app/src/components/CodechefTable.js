import { makeStyles,withStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link, Avatar } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useEffect, useState } from 'react';
const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
    table_dark:{
        minWidth: 700,
        backgroundColor:"Black",
        border:"2px solid White",
        borderRadius:"10px",
    }
});
export const CodechefTable = ({ darkmode,codechefUsers }) => {
    const [searchfield,setSearchfield]=useState("")
    const [filteredusers,setFilteredusers]=useState([])
useEffect(() => {
    if(searchfield === "")
    {
        // eslint-disable-next-line
        setFilteredusers(codechefUsers)
    }
    else
    {
        // eslint-disable-next-line
        setFilteredusers(codechefUsers.filter(
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
    const StyledTableCell = withStyles({
        root: {
          color: !darkmode?"Black":"White",
        }
      })(TableCell);
    const classes = useStyles();
    return (
<div className="codechef" style={{ display: "flex", justifyContent: "space-between",  marginTop: "2vh",width:"100vw",flexShrink:"0"}}>
            <div style={{visibility:"hidden",marginRight:"18vw"}}>
                </div>            <div >
                <TableContainer component={Paper}>
                    <Table className={darkmode?classes.table_dark:classes.table} aria-label="codeforces-table">
                        <TableHead>
                            <TableRow style={{backgroundColor:darkmode?"#1F2F98":"#1CA7FC"}}>
                            <StyledTableCell>Avatar</StyledTableCell>
                                <StyledTableCell>Username</StyledTableCell>
                                <StyledTableCell>Rating</StyledTableCell>
                                <StyledTableCell>Max rating</StyledTableCell>
                                <StyledTableCell>Global Rank</StyledTableCell>
                                <StyledTableCell>Country Rank</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredusers.map(cfUser => (
                                <TableRow key={cfUser.id}>
                                    <StyledTableCell>
                                        <Avatar src={cfUser.avatar} alt={`${cfUser.username} avatar`} />
                                        {/* TODO: Lazy load the avatars ? */}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Link style={{fontWeight: "bold",textDecoration:"none",color:darkmode?"#03DAC6":""}} href={`https://codechef.com/users/${cfUser.username}`} target="_blank">
                                            {cfUser.username}
                                        </Link>
                                    </StyledTableCell>
                                    <StyledTableCell>{cfUser.rating}</StyledTableCell>
                                    <StyledTableCell>{cfUser.max_rating}</StyledTableCell>
                                    <StyledTableCell>{cfUser.Global_rank}</StyledTableCell>
                                    <StyledTableCell>{cfUser.Country_rank}</StyledTableCell>
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



