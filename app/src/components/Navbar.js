import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Link, useNavigate } from "react-router-dom";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MaterialUISwitch from "@material-ui/core/Switch";
import CodechefLogo from "../assets/codechef.png";
import GitHubIcon from "@material-ui/icons/GitHub";
import CodeforcesLogo from "../assets/codeforces.svg";
import LeetcodeLogo from "../assets/leetcode.svg";
import OpenlakeLogo from "../assets/openlake.svg";
import LeetcodeRankingsLogo from "../assets/leetcodecontest.png";
import CCPS from "../assets/CCPS.jpeg";
import AuthContext from "../utils/AuthContext";
import { useMediaQuery } from "@material-ui/core";

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

  const { user, logoutUser } = useContext(AuthContext);

  const isMobile = useMediaQuery("(max-width: 860px)"); // Set the maximum width for mobile view

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{
          backgroundColor: !darkmode ? "#39ace7" : "#2F4562",
          position: "fixed",
        }}
      >
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Button
              style={{ color: "white", fontSize: "1.3rem", fontWeight: "900" }}
              onClick={tohome}
            >
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

          <div
            className={classes.platformButtons}
            style={{ display: "flex", justifyContent: "center" }}
          >
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
            onClick={logoutUser}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
