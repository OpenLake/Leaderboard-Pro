import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Footer = () => {
  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        style={{ color: 'white' }}
        {...props}
      >
        {'Copyright © '}
        <Link
          color="inherit"
          href="https://github.com/OpenLake/Leaderboard-Pro/"
        >
          LeaderBoard-Pro
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#1976d2',
        padding: '0.5rem',
        color: 'white',
        position: 'fixed',
        bottom: 0, // Align to the bottom
        left: 0, // Optional, align to the left
        right: 0, // Optional, align to the right
      }}
    >
      <Copyright />
    </div>
  );
};

export default Footer;
