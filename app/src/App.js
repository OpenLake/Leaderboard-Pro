import React, { useState, useEffect } from 'react';
import './App.css';
import { Grid } from '@material-ui/core';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Navbar } from './components/Navbar.js';
import { CodeforcesTable } from './components/CodeforcesTable.js';
import { CodechefTable } from './components/CodechefTable';
import { GithubTable } from './components/GithubTable';
import Profile1 from './components/Profile1.js';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { OpenlakeTable } from './components/OpenlakeTable';
import Login from './components/Login';
import HomePage from './components/HomePage';
import Register from './components/Register';
import { LeetcodeTable } from './components/LeetcodeTable';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './Context/AuthContext';
import GoToTop from './components/GoToTop';
import Footer from './components/Footer';
import LeetcodeRankings from './components/LeetcodeRankings';
import LeetcodeRankingsCCPS from './components/LeetcodeRankingsCCPS';
import LeetcodeGraphs from './components/LeetcodeGraphs';
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#686868 #686868',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: '#424242',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 20,
            backgroundColor: '#636363',
            minHeight: 15,
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
            {
              backgroundColor: '#4F4F4F',
            },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: '#686868',
          },
        },
      },
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#C1C1C1 #C1C1C1',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: '#F1F1F1',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 20,
            backgroundColor: '#C1C1C1',
            minHeight: 15,
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
            {
              backgroundColor: '#B5B5B5',
            },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: '#C1C1C1',
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
    const g = localStorage.getItem('dark-mode');
    if (g === 'off') localStorage.setItem('dark-mode', 'on');
    else localStorage.setItem('dark-mode', 'off');
  };
  useEffect(() => {
    const dm = localStorage.getItem('dark-mode');
    if (dm != null) {
      if (dm === 'on') setDarkmode(true);
      else setDarkmode(false);
    }
  }, []);
  useEffect(() => {
    fetch('http://localhost:8000/codeforces/')
      .then((res) => res.json())
      .then((res) => {
        setCodeforcesUsers(res);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/codechef/')
      .then((res) => res.json())
      .then((res) => {
        setCodechefUsers(res);
      });
  }, []);
  useEffect(() => {
    fetch('http://localhost:8000/leetcode/')
      .then((res) => res.json())
      .then((res) => {
        setLeetcodeUsers(res);
      });
  }, []);
  useEffect(() => {
    fetch('http://localhost:8000/openlake/')
      .then((res) => res.json())
      .then((res) => {
        setOpenlakeContributor(res);
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/github/')
      .then((res) => res.json())
      .then((res) => {
        setGithubUser(res);
      });
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
                <Switch>
                  <Route exact path="/register">
                    <Register darkmode={darkmode} />
                  </Route>
                  <Route exact path="/login">
                    <Login darkmode={darkmode} />
                  </Route>
                  <Route exact path="/leetcoderankingsccps">
                    <LeetcodeRankingsCCPS darkmode={darkmode} />
                  </Route>
                  <PrivateRoute exact path="/">
                    <HomePage />
                  </PrivateRoute>

                  <PrivateRoute exact path="/codeforces">
                    <CodeforcesTable
                      darkmode={darkmode}
                      codeforcesfriends={codeforcesfriends}
                      setCodeforcesfriends={setCodeforcesfriends}
                      codeforcesUsers={codeforcesUsers}
                      cfshowfriends={cfshowfriends}
                      setCfshowfriends={setCfshowfriends}
                    />
                  </PrivateRoute>
                  <PrivateRoute exact path="/codechef">
                    <CodechefTable
                      darkmode={darkmode}
                      codechefUsers={codechefUsers}
                      codecheffriends={codecheffriends}
                      setCodecheffriends={setCodecheffriends}
                      ccshowfriends={ccshowfriends}
                      setCCshowfriends={setCCshowfriends}
                    />
                  </PrivateRoute>
                  <PrivateRoute exact path="/openlake">
                    <OpenlakeTable
                      darkmode={darkmode}
                      codechefUsers={openlakeContributor}
                      codecheffriends={openlakefriends}
                      setCodecheffriends={setOpenlakefriends}
                      ccshowfriends={olshowfriends}
                      setCCshowfriends={setOlshowfriends}
                    />
                  </PrivateRoute>
                  <PrivateRoute exact path="/github">
                    <GithubTable
                      darkmode={darkmode}
                      githubUsers={githubUser}
                      githubfriends={githubfriends}
                      setGithubfriends={setGithubfriends}
                      ghshowfriends={ghshowfriends}
                      setGHshowfriends={setGhshowfriends}
                    />
                  </PrivateRoute>
                  <PrivateRoute exact path="/leetcode">
                    <LeetcodeTable
                      darkmode={darkmode}
                      leetcodeUsers={leetcodeUsers}
                      leetcodefriends={leetcodefriends}
                      setLeetcodefriends={setLeetcodefriends}
                      ltshowfriends={ltshowfriends}
                      setLTshowfriends={setLtshowfriends}
                    />
                  </PrivateRoute>
                  <PrivateRoute exact path="/profile">
                    <Profile1 darkmode={darkmode} />
                  </PrivateRoute>

                  <PrivateRoute exact path="/leetcoderankings">
                    <LeetcodeRankings darkmode={darkmode} />
                  </PrivateRoute>
                  <PrivateRoute path="/leetcoderanking/:username">
                    <LeetcodeGraphs darkmode={darkmode} />
                  </PrivateRoute>

                  {/* <PrivateRoute exact path="/leetcoderankingsccps">
                    <LeetcodeRankingsCCPS darkmode={darkmode} />
                  </PrivateRoute> */}

                  <Route exact path="/*">
                    <HomePage />
                  </Route>
                </Switch>
              </Grid>
            </Grid>
            <GoToTop />
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
export default App;
