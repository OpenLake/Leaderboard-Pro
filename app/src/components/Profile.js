import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

export default function Profile({darkmode,update_addUsernames}) {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Profile
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={update_addUsernames}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="CodeChef Username"
                  label="CodeChef Username"
                  type="cc_uname"
                  id="cc_uname"
                  autoComplete="new-cc_uname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="Codeforces Username"
                  label="Codeforces Username"
                  type="cf_uname"
                  id="cf_uname"
                  autoComplete="new-cf_uname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="Github Username "
                  label="Github Username  "
                  type="gh_uname"
                  id="gh_uname"
                  autoComplete="new-gh_uname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="LeetCode Username "
                  label="LeetCode Username  "
                  type="lt_uname"
                  id="lt_uname"
                  autoComplete="new-lt_uname"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              style={{backgroundColor:darkmode?"#ff8c0b":""}}
            >
              Update
            </Button>
            <Grid container alignItems="center" justifyContent="center">
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

