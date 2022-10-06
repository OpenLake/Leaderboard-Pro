import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CodeIcon from '@material-ui/icons/Code';
import GitHubIcon from '@material-ui/icons/GitHub';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import CodechefLogo from '../icons/codechef.png';
import CodeforcesLogo from '../icons/codeforces.svg';
import OpenlakeLogo from '../icons/openlake.svg';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    platformButtons: {
        flexGrow: 1,
    },
    title: {
        marginRight: theme.spacing(2),
    },
}));


export const Navbar = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Leaderboard Pro
                    </Typography>
                    <div className={classes.platformButtons}>
                    <Link to='/codechef'><IconButton edge="start" color="inherit" aria-label="menu">
                            <img src={CodechefLogo} width={25} height={25} alt="Codechef Logo" />
                        </IconButton></Link>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <GitHubIcon />
                        </IconButton>
                        <Link to='/codeforces'><IconButton edge="start" color="inherit" aria-label="menu">
                            <img src={CodeforcesLogo} width={25} height={25} alt="Codeforces Logo" />
                        </IconButton></Link>

                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <img src={OpenlakeLogo} width={25} height={25} alt="OpenLake Logo" />
                        </IconButton>
                    </div>


                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </div>
    );

}