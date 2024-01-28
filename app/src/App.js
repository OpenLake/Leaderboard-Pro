import React, { useState, useEffect } from "react";
import "./App.css";
import { Grid } from "@material-ui/core";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Navbar } from "./components/Navbar.js";
import { CodeforcesTable } from "./components/CodeforcesTable.js";
import { CodechefTable } from "./components/CodechefTable";
import { GithubTable } from "./components/GithubTable";
import Profile1 from "./components/Profile1.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { OpenlakeTable } from "./components/OpenlakeTable";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import { LeetcodeTable } from "./components/LeetcodeTable";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./utils/AuthContext";
import Footer from "./components/Footer";
import LeetcodeRankings from "./components/LeetcodeRankings";
import LeetcodeRankingsCCPS from "./components/LeetcodeRankingsCCPS";
import LeetcodeGraphs from "./components/LeetcodeGraphs";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#686868 #686868",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#424242",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 20,
            backgroundColor: "#636363",
            minHeight: 15,
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#4F4F4F",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#686868",
          },
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#C1C1C1 #C1C1C1",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#F1F1F1",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 20,
            backgroundColor: "#C1C1C1",
            minHeight: 15,
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#B5B5B5",
            },
          "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
            backgroundColor: "#C1C1C1",
          },
        },
      },
    },
  },
});

function App() {
  const [codechefUsers, setCodechefUsers] = useState([]);
  const [darkmode, setDarkmode] = useState(false);
  const [codeforcesUsers, setCodeforcesUsers] = useState([]);
  const [leetcodeUsers, setLeetcodeUsers] = useState([]);
  const [openlakeContributor, setOpenlakeContributor] = useState([]);
  const [githubUser, setGithubUser] = useState([]);
  const [codeforcesfriends, setCodeforcesfriends] = useState([]);
  const [cfshowfriends, setCfshowfriends] = useState(false);
  const [ccshowfriends, setCCshowfriends] = useState(false);
  const [codecheffriends, setCodecheffriends] = useState([]);
  const [ltshowfriends, setLtshowfriends] = useState(false);
  const [leetcodefriends, setLeetcodefriends] = useState([]);
  const [githubfriends, setGithubfriends] = useState([]);
  const [ghshowfriends, setGhshowfriends] = useState(false);
  const [openlakefriends, setOpenlakefriends] = useState([]);
  const [olshowfriends, setOlshowfriends] = useState(false);

  const toggle = () => {
    setDarkmode(!darkmode);
    const g = localStorage.getItem("dark-mode");
    if (g === "off") localStorage.setItem("dark-mode", "on");
    else localStorage.setItem("dark-mode", "off");
  };

  useEffect(() => {
    const dm = localStorage.getItem("dark-mode");
    if (dm !== null) {
      setDarkmode(dm === "on");
    }

    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          fetch(process.env.REACT_APP_BACKEND_URL + "/codeforces/").then(
            (res) => res.json()
          ),
          fetch(process.env.REACT_APP_BACKEND_URL + "/codechef/").then((res) =>
            res.json()
          ),
          fetch(process.env.REACT_APP_BACKEND_URL + "/leetcode/").then((res) =>
            res.json()
          ),
          fetch(process.env.REACT_APP_BACKEND_URL + "/openlake/").then((res) =>
            res.json()
          ),
          fetch(process.env.REACT_APP_BACKEND_URL + "/github/").then((res) =>
            res.json()
          ),
        ]);

        setCodeforcesUsers(responses[0]);
        setCodechefUsers(responses[1]);
        setLeetcodeUsers(responses[2]);
        setOpenlakeContributor(responses[3]);
        setGithubUser(responses[4]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={darkmode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <div className="App">
            <Navbar darkmode={darkmode} toggle={toggle} />
            <Grid container>
              <Grid item xs={6}>
                <Routes>
                  <Route
                    path="/register"
                    element={<Register darkmode={darkmode} />}
                  />
                  <Route
                    path="/login"
                    element={<Login darkmode={darkmode} />}
                  />
                  <Route
                    path="/leetcoderankingsccps"
                    element={<LeetcodeRankingsCCPS darkmode={darkmode} />}
                  />
                  <Route
                    path="/codeforces"
                    element={
                      <PrivateRoute>
                        <CodeforcesTable
                          darkmode={darkmode}
                          codeforcesfriends={codeforcesfriends}
                          setCodeforcesfriends={setCodeforcesfriends}
                          codeforcesUsers={codeforcesUsers}
                          cfshowfriends={cfshowfriends}
                          setCfshowfriends={setCfshowfriends}
                        />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/codechef"
                    element={
                      <PrivateRoute>
                        <CodechefTable
                          darkmode={darkmode}
                          codechefUsers={codechefUsers}
                          codecheffriends={codecheffriends}
                          setCodecheffriends={setCodecheffriends}
                          ccshowfriends={ccshowfriends}
                          setCCshowfriends={setCCshowfriends}
                        />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/openlake"
                    element={
                      <PrivateRoute>
                        <OpenlakeTable
                          darkmode={darkmode}
                          codechefUsers={openlakeContributor}
                          codecheffriends={openlakefriends}
                          setCodecheffriends={setOpenlakefriends}
                          ccshowfriends={olshowfriends}
                          setCCshowfriends={setOlshowfriends}
                        />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/github"
                    element={
                      <PrivateRoute>
                        <GithubTable
                          darkmode={darkmode}
                          githubUsers={githubUser}
                          githubfriends={githubfriends}
                          setGithubfriends={setGithubfriends}
                          ghshowfriends={ghshowfriends}
                          setGHshowfriends={setGhshowfriends}
                        />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/leetcode"
                    element={
                      <PrivateRoute>
                        <LeetcodeTable
                          darkmode={darkmode}
                          leetcodeUsers={leetcodeUsers}
                          leetcodefriends={leetcodefriends}
                          setLeetcodefriends={setLeetcodefriends}
                          ltshowfriends={ltshowfriends}
                          setLTshowfriends={setLtshowfriends}
                        />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <Profile1 darkmode={darkmode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/leetcoderankings"
                    element={
                      <PrivateRoute>
                        <LeetcodeRankings darkmode={darkmode} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/leetcoderanking/:username"
                    element={
                      <PrivateRoute>
                        <LeetcodeGraphs darkmode={darkmode} />
                      </PrivateRoute>
                    }
                  />
                  <Route path="/*" element={<HomePage />} />
                </Routes>
              </Grid>
            </Grid>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
