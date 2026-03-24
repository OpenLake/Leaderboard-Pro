import { useState, useEffect } from "react";
import { AtcoderTable } from "./components/AtcoderTable";
import "./App.css";
import { Navbar } from "./components/Navbar.jsx";
import { CFTable } from "./components/CodeforcesTable.jsx";
import { CCTable } from "./components/CodechefTable";
import { GHTable } from "./components/GithubTable";
import Profile from "./components/Profile.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { OpenLakeTable } from "./components/OpenlakeTable";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import { LCTable } from "./components/LeetcodeTable";
import PrivateRoute from "./utils/PrivateRoute";
import GoToTop from "./components/GoToTop";
import Footer from "./components/Footer";
import LeetcodeRankings from "./components/LeetcodeRankings";
import LeetcodeRankingsCCPS from "./components/LeetcodeRankingsCCPS";
import LeetcodeGraphs from "./components/LeetcodeGraphs";
import { AuthProvider } from "./Context/AuthContext.jsx";
import Dashboard from "./components/discussion-forum/dashboard.jsx";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar.jsx";
import { ThemeProvider } from "@/Context/ThemeProvider.jsx";
import { NavMenu } from "./components/NavMenu";
import { UnifiedLeaderboard } from "./components/UnifiedLeaderboard";
import PublicRoute from "./Context/PublicRoute";
import ContestCalendar from "./components/ContestCalendar";
import Blogs from "./components/Blogs.jsx";
import Achievements from "./components/Achievements.jsx";
import Friends from "./components/Friends.jsx";

const BACKEND = import.meta.env.VITE_BACKEND;

const fetchListSafely = async (endpoint, setData) => {
  if (!BACKEND) {
    setData([]);
    return;
  }
  try {
    const res = await fetch(BACKEND + endpoint);
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok || !contentType.toLowerCase().includes("application/json")) {
      setData([]);
      return;
    }
    const data = await res.json();
    setData(Array.isArray(data) ? data : []);
  } catch {
    setData([]);
  }
};

function App() {
  const [codechefUsers, setCodechefUsers] = useState([]);
  const [darkmode] = useState(false);
  const [codeforcesUsers, setCodeforcesUsers] = useState([]);
  const [leetcodeUsers, setLeetcodeUsers] = useState([]);
  const [openlakeContributor, setOpenlakeContributor] = useState([]);
  const [githubUser, setGithubUser] = useState([]);
  const [atcoderUsers, setAtcoderUsers] = useState([]);

  useEffect(() => {
    fetchListSafely("/codeforces/", setCodeforcesUsers);
    fetchListSafely("/codechef/", setCodechefUsers);
    fetchListSafely("/leetcode/", setLeetcodeUsers);
    fetchListSafely("/openlake/", setOpenlakeContributor);
    fetchListSafely("/github/", setGithubUser);
    fetchListSafely("/atcoder/", setAtcoderUsers);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark">
      <Router>
        <AuthProvider>
          <SidebarProvider defaultOpen={false}>
            <Navbar />
            <SidebarInset>
              <div className="App bg-background">
                <NavMenu />
                <Routes>

                <Route exact path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route exact path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route
                  exact
                  path="/leetcoderankingsccps"
                  element={<LeetcodeRankingsCCPS />}
                />
                <Route
                  exact
                  path="/"
                  element={<HomePage />}
                />
                <Route
                  exact
                  path="/codeforces"
                  element={<CFTable codeforcesUsers={codeforcesUsers} />}
                />
                <Route
                  exact
                  path="/codechef"
                  element={<CCTable codechefUsers={codechefUsers} />}
                />
                <Route
                  exact
                  path="/openlake"
                  element={<OpenLakeTable OLUsers={openlakeContributor} />}
                />
                <Route
                  exact
                  path="/github"
                  element={<GHTable githubUsers={githubUser} />}
                />
                <Route
                  exact
                  path="/atcoder"
                  element={
                    <PrivateRoute>
                      <AtcoderTable atcoderUsers={atcoderUsers} />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/leetcode"
                  element={<LCTable leetcodeUsers={leetcodeUsers} />}
                />
                <Route
                  exact
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
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
                {/* ADD YOUR NEW ROUTE HERE */}
                <Route
                  exact
                  path="/leaderboards"
                  element={
                    <PrivateRoute>
                      <UnifiedLeaderboard 
                        codeforcesUsers={codeforcesUsers}
                        codechefUsers={codechefUsers}
                        leetcodeUsers={leetcodeUsers}
                        githubUsers={githubUser}
                        openlakeUsers={openlakeContributor}
                      />
                    </PrivateRoute>
                  }
                />
                {/* <Route exact path="/leetcoderankingccps" element={<PrivateRoute><LeetcodeRankingsCCPS darkmode={darkmode} /></PrivateRoute>} /> */}
                <Route
                  exact
                  path="/contests"
                  element={<ContestCalendar />}
                />
                <Route
                  exact
                  path="/blogs"
                  element={<Blogs />}
                />
                <Route
                  exact
                  path="/achievements"
                  element={
                    <PrivateRoute>
                      <Achievements />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path="/friends"
                  element={
                    <PrivateRoute>
                      <Friends />
                    </PrivateRoute>
                  }
                />
                <Route exact path="/*" element={<HomePage />} />
              </Routes>
              <GoToTop />
              <Footer />
            </div>
            </SidebarInset>
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
export default App;
