import React, { useState, useEffect } from "react";
import "./App.css";
import { Navbar } from "./components/Navbar.jsx";
import { CodeforcesTable } from "./components/CodeforcesTable.jsx";
import { CodechefTable } from "./components/CodechefTable";
import { GithubTable } from "./components/GithubTable";
import Profile from "./components/Profile.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { OpenlakeTable } from "./components/OpenlakeTable";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import { LeetcodeTable } from "./components/LeetcodeTable";
import PrivateRoute from "./utils/PrivateRoute";
import GoToTop from "./components/GoToTop";
import Footer from "./components/Footer";
import LeetcodeRankings from "./components/LeetcodeRankings";
import LeetcodeRankingsCCPS from "./components/LeetcodeRankingsCCPS";
import LeetcodeGraphs from "./components/LeetcodeGraphs";
import { AuthProvider } from "./Context/AuthContext.jsx";
import Dashboard from "./components/discussion-forum/dashboard.jsx";
import {
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar.jsx";
import { ThemeProvider } from "@/Context/ThemeProvider.jsx";
import { NavMenu } from "./components/NavMenu";
const BACKEND = import.meta.env.VITE_BACKEND;
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
  useEffect(() => {
    fetch(BACKEND + "/codeforces/")
      .then((res) => res.json())
      .then((res) => {
        setCodeforcesUsers(res);
      });
  }, []);

  useEffect(() => {
    fetch(BACKEND + "/codechef/")
      .then((res) => res.json())
      .then((res) => {
        setCodechefUsers(res);
      });
  }, []);
  useEffect(() => {
    fetch(BACKEND + "/leetcode/")
      .then((res) => res.json())
      .then((res) => {
        setLeetcodeUsers(res);
      });
  }, []);
  useEffect(() => {
    fetch(BACKEND + "/openlake/")
      .then((res) => res.json())
      .then((res) => {
        setOpenlakeContributor(res);
      });
  }, []);

  useEffect(() => {
    fetch(BACKEND + "/github/")
      .then((res) => res.json())
      .then((res) => {
        setGithubUser(res);
      });
  }, []);

  return (
    <ThemeProvider defaultTheme="dark">
      <Router>
        <AuthProvider>
          <SidebarProvider>
            <Navbar />
            <div className="App bg-background w-full">
              <NavMenu />
              <Routes>
                <Route
                  exact
                  path="/register"
                  element={<Register darkmode={darkmode} />}
                />
                <Route
                  exact
                  path="/login"
                  element={<Login darkmode={darkmode} />}
                />
                <Route
                  exact
                  path="/leetcoderankingsccps"
                  element={<LeetcodeRankingsCCPS darkmode={darkmode} />}
                />
                <Route
                  exact
                  path="/"
                  element={
                    <PrivateRoute>
                      <HomePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
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
                  exact
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
                  exact
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
                  exact
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
                  exact
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
                  exact
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile darkmode={darkmode} />-
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/leetcoderankings"
                  element={
                    <PrivateRoute>
                      <LeetcodeRankings darkmode={darkmode} />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/leetcoderanking/:username"
                  element={
                    <PrivateRoute>
                      <LeetcodeGraphs darkmode={darkmode} />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                {/* <Route exact path="/leetcoderankingccps" element={<PrivateRoute><LeetcodeRankingsCCPS darkmode={darkmode} /></PrivateRoute>} /> */}
                <Route exact path="/*" element={<HomePage />} />
              </Routes>
              <GoToTop />
              <Footer />
            </div>
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
export default App;
