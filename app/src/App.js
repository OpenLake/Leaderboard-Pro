import React, { useState, useEffect } from "react";
import "./App.css";
import { Grid } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { darkTheme, lightTheme } from "./theme.js";
import { Navbar } from "./components/Navbar.js";
import { CodeforcesTable } from "./components/CodeforcesTable.js";
import { CodechefTable } from "./components/CodechefTable";
import { GithubTable } from "./components/GithubTable";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { OpenlakeTable } from "./components/OpenlakeTable";

function App() {
  const [darkmode, setDarkmode] = useState(false);
  const [codechefUsers, setCodechefUsers] = useState([]);

  const [codeforcesUsers, setCodeforcesUsers] = useState([]);

  const [openlakeContributor, setOpenlakeContributor] = useState([]);
  const [githubUser, setGithubUser] = useState([]);

  const toggle = () => {
    setDarkmode(!darkmode);
    const g = localStorage.getItem("dark-Mode");
    if (g === "off") localStorage.setItem("dark-Mode", "on");
    else localStorage.setItem("dark-Mode", "off");
    window.location.reload();
  };
  useEffect(() => {
    fetch("http://localhost:8000/codeforces/")
      .then((res) => res.json())
      .then((res) => {
        setCodeforcesUsers(res);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/codechef/")
      .then((res) => res.json())
      .then((res) => {
        setCodechefUsers(res);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/openlake/")
      .then((res) => res.json())
      .then((res) => {
        setOpenlakeContributor(res);
      });
  }, []);
  
    useEffect(() => {
    fetch("http://localhost:8000/github/")
      .then((res) => res.json())
      .then((res) => {
        setGithubUser(res);
      });
  }, []);

  useEffect(() => {
    const dm = localStorage.getItem("dark-Mode");
    if (dm != null) {
      if (dm === "on") setDarkmode(true);
      else setDarkmode(false);
    }
  }, []);


  return (
    <ThemeProvider theme={darkmode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar darkmode={darkmode} toggle={toggle} />
          <Grid container>
            <Grid item xs={6}>
              <Switch>
                <Route path="/codeforces">
                  <CodeforcesTable codeforcesUsers={codeforcesUsers} />
                </Route>
                <Route path="/codechef">
                  <CodechefTable codechefUsers={codechefUsers} />
                </Route>
                <Route path="/openlake">
                  <OpenlakeTable openlakeContributor={openlakeContributor} />
                </Route>
                <Route path="/github">
                  <GithubTable githubUser={githubUser} />
                </Route>
              </Switch>
            </Grid>
          </Grid>
        </div>
      </Router>
    </ThemeProvider>
  );
}
export default App;
