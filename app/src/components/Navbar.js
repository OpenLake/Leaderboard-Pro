import React, { useState, useContext } from "react";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MaterialUISwitch from "@mui/material/Switch";
import CodechefLogo from "../icons/codechef.png";
import GitHubIcon from "@material-ui/icons/GitHub";
import CodeforcesLogo from "../icons/codeforces.svg";
import LeetcodeLogo from "../icons/leetcode.svg";
import OpenlakeLogo from "../icons/openlake.svg";
import LeetcodeRankingsLogo from "../icons/leetcodecontest.png";
import CCPS from "../icons/CCPS.jpeg";
import AuthContext from "../Context/AuthContext";
import { useMediaQuery } from "@mui/material";
import { useAuth } from "../firebase/AuthContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textAlign: "left",
  },
  platformButtons: {
    // display: "flex",
    // alignItems: "center",
    // marginLeft:"40px"
  },
  desktopLogos: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

export const Navbar = ({ darkmode, toggle }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const manageClick = () => {
    navigate("/profile");
  };
  const tohome = () => {
    navigate("/");
  };
  const toLogin = () => {
    navigate("/login");
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const { user, logout } = useAuth();

  const isMobile = useMediaQuery("(max-width: 600px)"); // Set the maximum width for mobile view

  return (
    <div className={classes.root} style={{ zIndex: 1000 }}>
      <AppBar
        position="static"
        style={{
          backgroundColor: !darkmode ? "#39ace7" : "#2F4562",
          position: "fixed",
        }}
      >
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Button style={{ color: "white", fontSize:'1.3rem', fontWeight:'900' }} onClick={tohome}>
              Leaderboard Pro
            </Button>
          </Typography>

          {isMobile && ( // Render the hamburger icon only in mobile view
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Mobile Menu */}
          <Menu
            id="mobile-menu"
            anchorEl={null}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            keepMounted
            open={mobileMenuOpen}
            onClose={handleMobileMenuClose}
          >
            <MenuItem onClick={handleMobileMenuClose}>
              <Link to="/codechef">Codechef</Link>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              <Link to="/github">GitHub</Link>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              <Link to="/codeforces">Codeforces</Link>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              <Link to="/leetcode">LeetCode</Link>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              <Link to="/openlake">OpenLake</Link>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              <Link to="/leetcoderankings">LeetCode Rankings</Link>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              <Link to="/leetcoderankingsccps">LeetCode Rankings (CCPS)</Link>
            </MenuItem>
          </Menu>

          <div className={classes.platformButtons} style={{display:"flex",justifyContent:"center"}}>
            {/* Logos (hidden in mobile view) */}
            <div className={classes.desktopLogos}>
              <Link style={{ margin: "12px" }} to="/codechef">
                <IconButton edge="start" color="inherit" aria-label="menu">
                  <img
                    src={CodechefLogo}
                    width={25}
                    height={25}
                    alt="Codechef Logo"
                  />
                </IconButton>
              </Link>

              <Link to="/github" style={{ margin: "12px" }}>
                <IconButton edge="start" color="inherit" aria-label="menu">
                  <GitHubIcon
                    style={{
                      filter: darkmode ? "invert(100)" : "brightness(20%)",
                    }}
                  />
                </IconButton>
              </Link>

              <Link style={{ margin: "12px" }} to="/codeforces">
                <IconButton edge="start" color="inherit" aria-label="menu">
                  <img
                    src={CodeforcesLogo}
                    width={25}
                    height={25}
                    alt="Codeforces Logo"
                  />
                </IconButton>
              </Link>
              <Link style={{ margin: "12px" }} to="/leetcode">
                <IconButton edge="start" color="inherit" aria-label="menu">
                  <img
                    src={LeetcodeLogo}
                    width={25}
                    height={25}
                    alt="LeetCode Logo"
                    style={{ filter: darkmode ? "invert(100)" : "" }}
                  />
                </IconButton>
              </Link>
              <Link style={{ margin: "12px" }} to="/openlake">
                <IconButton edge="start" color="inherit" aria-label="menu">
                  <img
                    src={OpenlakeLogo}
                    width={25}
                    height={25}
                    alt="OpenLake Logo"
                  />
                </IconButton>
              </Link>

              <Link style={{ margin: "12px" }} to="leetcoderankings">
                <IconButton edge="start" color="inherit" aria-label="menu">
                  <img
                    src={LeetcodeRankingsLogo}
                    width={25}
                    height={25}
                    alt="OpenLake Logo"
                  />
                </IconButton>
              </Link>
              <Link style={{ margin: "12px" }} to="/leetcoderankingsccps">
                <IconButton edge="start" color="inherit" aria-label="menu">
                  <img src={CCPS} width={25} height={25} alt="" />
                </IconButton>
              </Link>
            </div>
          </div>
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
          <Button
            color="inherit"
            style={{ display: user ? "block" : "none", margin: "12px" }}
            onClick={manageClick}
          >
            Profile
          </Button>
          <Button
            color="inherit"
            style={{ display: user ? "none" : "block", margin: "12px" }}
            onClick={toLogin}
          >
            Login
          </Button>
          <Button
            color="inherit"
            style={{ display: user ? "block" : "none", margin: "12px" }}
            onClick={logout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
