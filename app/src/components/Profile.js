import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { Grid } from "@mui/material";
import { useAuth } from "../Context/AuthContext";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/OpenLake/Leaderboard-Pro/">
        LeaderBoard-Pro
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

let fields = [
  { label: "CodeChef Username", tag: "codechef" },
  { label: "Codeforces Username", tag: "codeforces" },
  { label: "LeetCode Username", tag: "leetcode" },
  { label: "Github Username", tag: "github" },
];

export default function Profile({ darkmode }) {
  let { update_addUsernames, userNames } = useAuth();
  if (userNames) {
    fields.forEach((x) => {
      x["helperText"] = userNames[x["tag"]]?.username
        ? `Currently ${userNames[x["tag"]].username}`
        : `Currently not set`;
    });
  } else {
    fields.forEach((x) => {
      x["helperText"] = `Currently not set`;
    });
  }
  let elems = fields.map((x) => (
    <Grid key={x["tag"]} size={12}>
      <TextField
        fullWidth
        name={x["label"]}
        label={x["label"]}
        type={x["tag"]}
        id={x["tag"]}
        autoComplete={`new-${x["tag"]}`}
        helperText={x["helperText"]}
      />
    </Grid>
  ));
  return (
    <StyledEngineProvider injectFirst>
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
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {elems}
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ backgroundColor: darkmode ? "#ff8c0b" : "" }}
                onClick={update_addUsernames}
              >
                Update
              </Button>
              <Grid
                container
                alignItems="center"
                justifyContent="center"
              ></Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
