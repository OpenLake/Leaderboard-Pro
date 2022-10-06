import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import { Checkbox, Grid } from '@material-ui/core'
import CssBaseline from "@material-ui/core/CssBaseline";
import { darkTheme, lightTheme } from './theme.js';

import { Navbar } from './components/Navbar.js';
import { CodeforcesTable } from './components/CodeforcesTable.js';
import { CodechefTable } from "./components/CodechefTable";
import { ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = localStorage.getItem("darkMode")
    ? localStorage.getItem("darkMode") === "true"
    : prefersDark;
  const [darkMode, setDarkMode] = useState(isDark);
  const [codechefUsers, setCodechefUsers] = useState([]);

  const [codeforcesUsers, setCodeforcesUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/codeforces/')
      .then(res => res.json())
      .then(res => {
        setCodeforcesUsers(res)
      })

  }, [])
  useEffect(() => {
    fetch("http://localhost:8000/codechef/")
      .then((res) => res.json())
      .then((res) => {
        setCodechefUsers(res);
      });
  }, []);

  function toggleDarkMode() {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  }

  return (
    <Router>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <div className="App">
          <Navbar />

          <Checkbox checked={darkMode} onClick={() => toggleDarkMode()} />
          {darkMode ? "Dark" : "Light"}

          <Grid container>
            <Grid item xs={6}>
              <Switch>
                <Route path="/codeforces">
                  <CodeforcesTable codeforcesUsers={codeforcesUsers} />
                </Route>
                <Route path="/codechef">
                <CodechefTable codechefUsers={codechefUsers} />
                </Route>
              </Switch>
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
