import React from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        className={styles.textContainer}
        {...props}
      >
        <Link
          color="inherit"
          href="https://github.com/OpenLake/Leaderboard-Pro"
          className={styles.link}
        >
          Leaderboard-Pro
        </Link>
        {" | Made with 🤍 by "}
        <Link color="inherit" href="https://github.com/OpenLake/" className={styles.link}>
          OpenLake
        </Link>
      </Typography>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <Copyright />
      </div>
    </div>
  );
};

export default Footer;
