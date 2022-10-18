import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import GitHubIcon from "@material-ui/icons/GitHub";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Link } from "react-router-dom";
import CodechefLogo from "../icons/codechef.png";
import CodeforcesLogo from "../icons/codeforces.svg";
import OpenlakeLogo from "../icons/openlake.svg";

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

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));
export const Navbar = ({ toggle, darkmode }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Leaderboard Pro
          </Typography>
          <div className={classes.platformButtons}>
            <Link style={{ margin: "10px" }} to="/codechef">
              <IconButton edge="start" color="inherit" aria-label="menu">
                <img
                  src={CodechefLogo}
                  width={25}
                  height={25}
                  alt="Codechef Logo"
                />
              </IconButton>
            </Link>
            <Link to="/" style={{ margin: "10px"}}>
              <IconButton edge="start" color="inherit" aria-label="menu">
                <GitHubIcon style={{filter:darkmode?"invert(100)":"brightness(20%)"}}/>
              </IconButton>
            </Link>
            <Link style={{ margin: "10px" }} to="/codeforces">
              <IconButton edge="start" color="inherit" aria-label="menu">
                <img
                  src={CodeforcesLogo}
                  width={25}
                  height={25}
                  alt="Codeforces Logo"
                />
              </IconButton>
            </Link>
            <Link style={{ margin: "10px" }} to="/openlake">
              <IconButton edge="start" color="inherit" aria-label="menu">
                <img
                  src={OpenlakeLogo}
                  width={25}
                  height={25}
                  alt="OpenLake Logo"
                />
              </IconButton>
            </Link>
          </div>
          <div>
            <FormGroup>
              <FormControlLabel
                control={
                  <MaterialUISwitch
                    sx={{ m: 1 }}
                    checked={darkmode}
                    onChange={toggle}
                  />
                }
              />
            </FormGroup>
          </div>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
