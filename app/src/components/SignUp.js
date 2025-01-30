import { React, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthContext from '../Context/AuthContext.js';
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://github.com/OpenLake/Leaderboard-Pro/">
        LeaderBoard-Pro
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp({ registerUser }) {
  let { toLogin } = useContext(AuthContext);
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={registerUser}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  size="small"
                  name="first_name"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  id="last_name"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  defaultValue=""
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  name="username"
                  label="username"
                  type="username"
                  id="username"
                  autoComplete="new-username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  name="CodeChef Username"
                  label="CodeChef Username"
                  type="text"
                  id="cc_uname"
                  autoComplete="new-cc_uname"
                  defaultValue=""
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  name="Codeforces Username"
                  label="Codeforces Username"
                  type="text"
                  id="cf_uname"
                  autoComplete="new-cf_uname"
                  defaultValue=""
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  name="Github Username "
                  label="Github Username  "
                  type="text"
                  id="gh_uname"
                  autoComplete="new-gh_uname"
                  defaultValue=""
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  fullWidth
                  name="LeetCode Username "
                  label="LeetCode Username  "
                  type="text"
                  id="lt_uname"
                  autoComplete="new-lt_uname"
                  defaultValue=""
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container alignItems="center" justifyContent="center">
              <Grid item>
                <Button
                  variant="body2"
                  style={{ color: 'red' }}
                  onClick={toLogin}
                >
                  Already have an account? Sign in
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
