import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { DataTable } from "./ui/data-table";
import { Input } from "@/components/ui/input";
import { Switch } from "./ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { User, Trophy, Users, Loader2, Search, X, Crown } from "lucide-react";

const BACKEND = import.meta.env.VITE_BACKEND;

export function CFTable({ codeforcesUsers }) {
  const [searchfield, setSearchfield] = useState("");
  const [filteredusers, setFilteredusers] = useState([]);
  const [todisplayusers, setTodisplayusers] = useState([]);
  const { open, isMobile } = useSidebar();
  const [codeforcesfriends, setCodeforcesfriends] = useState([]);
  const [cfshowfriends, setCfshowfriends] = useState(false);
  const [activeTab, setActiveTab] = useState("friends");
  const [contestId, setContestId] = useState("");
  const [contestStandings, setContestStandings] = useState([]);
  const [loadingContest, setLoadingContest] = useState(false);
  const [contestError, setContestError] = useState("");
  const [contestName, setContestName] = useState("");
  const [contestLoaded, setContestLoaded] = useState(false);
  const [showFriendsInContest, setShowFriendsInContest] = useState(false);
  
  // New states for logged in user
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch logged in user data on component mount
// Fetch logged in user data on component mount
useEffect(() => {
  const fetchLoggedInUser = async () => {
    try {
      const authTokens = localStorage.getItem("authTokens");
      if (authTokens) {
        const tokens = JSON.parse(authTokens);
        
        // Get user details from your backend endpoint
        const response = await fetch(`${BACKEND}/userDetails/`, {
          headers: {
            Authorization: `Bearer ${tokens.access}`,
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log("User data from backend:", userData);
          
          // Extract Codeforces username from the response
          // Based on your Django view, it's in userDetails.cf_uname
          let currentUsername = "";
          
          // Try different possible locations
          if (userData.codeforces && userData.codeforces.username) {
            currentUsername = userData.codeforces.username;
          } else if (userData.cf_uname) {
            currentUsername = userData.cf_uname;
          } else if (userData.userDetails && userData.userDetails.cf_uname) {
            currentUsername = userData.userDetails.cf_uname;
          } else if (userData.username) {
            // Fallback to main username
            currentUsername = userData.username;
          }
          
          console.log("Extracted Codeforces username:", currentUsername);
          
          if (currentUsername) {
            // First try to find in local codeforcesUsers
            const cfUser = codeforcesUsers.find(
              user => user.username.toLowerCase() === currentUsername.toLowerCase()
            );
            
            if (cfUser) {
              console.log("Found user in local data:", cfUser.username);
              setLoggedInUser(cfUser);
              return;
            }
            
            // If not found locally, fetch from Codeforces API
            console.log("Fetching user data from Codeforces API...");
            const cfResponse = await fetch(
              `https://codeforces.com/api/user.info?handles=${currentUsername}`,
              { timeout: 10000 }
            );
            
            if (cfResponse.ok) {
              const cfData = await cfResponse.json();
              if (cfData.status === "OK" && cfData.result && cfData.result.length > 0) {
                const cfUserData = cfData.result[0];
                
                // Also fetch solved problems count
                let totalSolved = 0;
                try {
                  const solvedResponse = await fetch(
                    `https://codeforces.com/api/user.status?handle=${currentUsername}&from=1&count=1000`,
                    { timeout: 10000 }
                  );
                  if (solvedResponse.ok) {
                    const solvedData = await solvedResponse.json();
                    if (solvedData.status === "OK") {
                      // Count unique solved problems
                      const solvedProblems = new Set();
                      solvedData.result.forEach(submission => {
                        if (submission.verdict === "OK") {
                          const problemId = `${submission.problem.contestId}${submission.problem.index}`;
                          solvedProblems.add(problemId);
                        }
                      });
                      totalSolved = solvedProblems.size;
                    }
                  }
                } catch (e) {
                  console.log("Could not fetch solved problems:", e);
                }
                
                const userObj = {
                  username: cfUserData.handle,
                  rating: cfUserData.rating || 0,
                  max_rating: cfUserData.maxRating || 0,
                  avatar: cfUserData.titlePhoto || "",
                  last_activity: cfUserData.lastOnlineTimeSeconds || 0,
                  total_solved: totalSolved
                };
                
                console.log("User data from Codeforces API:", userObj);
                setLoggedInUser(userObj);
                return;
              }
            }
          }
        }
        
        // If we get here, something went wrong
        console.warn("Could not fetch logged in user data");
        if (codeforcesUsers.length > 0) {
          setLoggedInUser(codeforcesUsers[0]);
        }
      } else {
        console.warn("No auth tokens found");
        if (codeforcesUsers.length > 0) {
          setLoggedInUser(codeforcesUsers[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching logged in user:", error);
      // Fallback to first user
      if (codeforcesUsers.length > 0) {
        setLoggedInUser(codeforcesUsers[0]);
      }
    } finally {
      setLoadingUser(false);
    }
  };

  fetchLoggedInUser();
}, [codeforcesUsers]);
  // Fetch contest standings
  const fetchContestStandings = async () => {
    if (!contestId) {
      setContestError("Please enter a contest ID");
      return;
    }

    setLoadingContest(true);
    setContestError("");
    setContestName("");
    setContestLoaded(false);
    
    try {
      const response = await fetch(
        `https://codeforces.com/api/contest.standings?contestId=${contestId}&from=1&count=200`,
        { timeout: 10000 }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch contest ${contestId} (Status: ${response.status})`);
      }

      const data = await response.json();
      
      if (data.status !== "OK") {
        throw new Error(data.comment || "Codeforces API error");
      }
      
      if (!data.result || !data.result.rows) {
        throw new Error("Invalid response format from Codeforces");
      }
      
      const standings = data.result.rows.map(row => ({
        username: row.party.members[0].handle,
        rank: row.rank,
        points: row.points, 
        contest_id: contestId,
        avatar: `https://codeforces.org/userphoto/title/${row.party.members[0].handle}/photo.jpg`,
        isFriend: codeforcesfriends.includes(row.party.members[0].handle),
        isLoggedInUser: loggedInUser && loggedInUser.username === row.party.members[0].handle
      }));
      
      setContestStandings(standings);
      setContestLoaded(true);
      
      if (data.result.contest) {
        setContestName(data.result.contest.name);
      }
      
    } catch (error) {
      console.error("Error fetching contest standings:", error);
      setContestError(error.message || "Failed to load contest standings");
      setContestStandings([]);
      setContestLoaded(false);
    } finally {
      setLoadingContest(false);
    }
  };

  // Get friends list (TODO: Implement backend integration)
  const getcffriends = async () => {
    try {
      // TODO: Implement actual friends list from backend
      // For now, using local storage
      const savedFriends = localStorage.getItem('codeforces_friends');
      if (savedFriends) {
        setCodeforcesfriends(JSON.parse(savedFriends));
      } else {
        setCodeforcesfriends([]);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      setCodeforcesfriends([]);
    }
  };

  // Friend functions
  async function addfriend(username) {
    const currentFriends = Array.isArray(codeforcesfriends) ? codeforcesfriends : [];
    if (!currentFriends.includes(username)) {
      const updatedFriends = [...currentFriends, username];
      setCodeforcesfriends(updatedFriends);
      localStorage.setItem('codeforces_friends', JSON.stringify(updatedFriends));
    }
  } 
  
  async function dropfriend(username) {
    const currentFriends = Array.isArray(codeforcesfriends) ? codeforcesfriends : [];
    const updatedFriends = currentFriends.filter((friend) => friend !== username);
    setCodeforcesfriends(updatedFriends);
    localStorage.setItem('codeforces_friends', JSON.stringify(updatedFriends));
  }
  
  useEffect(() => {
    getcffriends();
  }, []);

  // Filter logic for friends tab
  useEffect(() => {
    let usersToDisplay = codeforcesUsers;
    
    const friendsArray = Array.isArray(codeforcesfriends) ? codeforcesfriends : [];
    
    if (activeTab === "friends") {
      // Always show friends in friends tab
      usersToDisplay = usersToDisplay.filter((user) =>
        friendsArray.includes(user.username)
      );
      
      // Add logged in user to the list if not already a friend
      if (loggedInUser && !friendsArray.includes(loggedInUser.username)) {
        usersToDisplay = [loggedInUser, ...usersToDisplay];
      }
      
      // Apply search filter
      if (searchfield) {
        usersToDisplay = usersToDisplay.filter((user) =>
          user.username.toLowerCase().includes(searchfield.toLowerCase())
        );
      }
    }
    
    // TODO: Sort by rating (implement when backend is ready)
    usersToDisplay.sort((a, b) => b.rating - a.rating);
    
    setFilteredusers(usersToDisplay);
  }, [activeTab, codeforcesfriends, codeforcesUsers, loggedInUser, searchfield]);

  // Filter contest standings by friends
  const filteredContestStandings = showFriendsInContest 
    ? contestStandings.filter(standing => standing.isFriend || standing.isLoggedInUser)
    : contestStandings;

  // Columns for contest standings
  const contestColumns = [
    { 
      accessorKey: "rank", 
      header: "Rank",
      cell: ({ row }) => {
        const rank = row.getValue("rank");
        const isLoggedInUser = row.original.isLoggedInUser;
        let rankClass = "font-bold";
        
        if (isLoggedInUser) {
          rankClass += " text-green-600";
        } else if (rank === 1) {
          rankClass += " text-yellow-600";
        } else if (rank === 2) {
          rankClass += " text-gray-400";
        } else if (rank === 3) {
          rankClass += " text-amber-700";
        }
        
        return (
          <div className="flex items-center gap-2">
            {isLoggedInUser && <Crown className="h-3 w-3 text-green-600" />}
            <span className={rankClass}>#{rank}</span>
          </div>
        );
      }
    },
    {
      accessorKey: "username",
      header: "Participant",
      cell: ({ row }) => {
        const username = row.getValue("username");
        const avatar = row.original.avatar;
        const isLoggedInUser = row.original.isLoggedInUser;
        const isFriend = row.original.isFriend;
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className={`h-8 w-8 ${isLoggedInUser ? 'ring-2 ring-green-500' : ''}`}>
              <AvatarImage src={avatar} alt={username} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Button variant="link" asChild className="px-0 h-auto">
                  <a
                    href={`https://codeforces.com/profile/${username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {username}
                  </a>
                </Button>
                {isLoggedInUser && (
                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                    You
                  </span>
                )}
                {isFriend && !isLoggedInUser && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Friend
                  </span>
                )}
              </div>
              {loggedInUser && loggedInUser.username === username && activeTab === "contest" && (
                <div className="text-xs text-gray-500">
                  Your standing in this contest
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    { 
      accessorKey: "points", 
      header: "Points",
      cell: ({ row }) => {
        const points = row.getValue("points");
        const isLoggedInUser = row.original.isLoggedInUser;
        
        return (
          <span className={`font-semibold ${isLoggedInUser ? 'text-green-600' : 'text-blue-600'}`}>
            {parseFloat(points).toFixed(0)}
          </span>
        );
      }
    },
  ];

  // Columns for friends leaderboard
  const columns = [
    {
      accessorKey: "avatar",
      header: "Avatar",
      cell: ({ row }) => {
        const isLoggedInUser = loggedInUser && loggedInUser.username === row.getValue("username");
        return (
          <Avatar className={isLoggedInUser ? 'ring-2 ring-green-500' : ''}>
            <AvatarImage src={row.getValue("avatar")} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const username = row.getValue("username");
        const isLoggedInUser = loggedInUser && loggedInUser.username === username;
        
        return (
          <div className="flex items-center gap-2">
            <Button variant="link" asChild>
              <a
                href={`https://codeforces.com/profile/${username}`}
                target="_blank"
                rel="noreferrer"
              >
                {username}
              </a>
            </Button>
            {isLoggedInUser && (
              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                You
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => {
        const rating = row.getValue("rating");
        const isLoggedInUser = loggedInUser && loggedInUser.username === row.getValue("username");
        let color = "text-gray-600";
        if (rating >= 2400) color = "text-red-600";
        else if (rating >= 2100) color = "text-orange-600";
        else if (rating >= 1900) color = "text-purple-600";
        else if (rating >= 1600) color = "text-blue-600";
        else if (rating >= 1400) color = "text-cyan-600";
        else if (rating >= 1200) color = "text-green-600";
        
        return (
          <div className="flex items-center gap-2">
            <span className={`font-bold ${color}`}>{rating}</span>
            {isLoggedInUser && <Crown className="h-4 w-4 text-green-600" />}
          </div>
        );
      },
    },
    {
      accessorKey: "max_rating",
      header: "Max Rating",
    },
    {
      accessorKey: "last_activity",
      header: "Last Activity",
      cell: ({ row }) => timeConverter(row.getValue("last_activity")),
    },
    {
      accessorKey: "total_solved",
      header: "Problems Solved",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const username = row.getValue("username");
        const isLoggedInUser = loggedInUser && loggedInUser.username === username;
        const friendsArray = Array.isArray(codeforcesfriends) ? codeforcesfriends : [];
        const isFriend = friendsArray.includes(username);
        
        if (isLoggedInUser) {
          return (
            <div className="flex justify-end">
              <span className="px-3 py-1 text-sm text-green-700 bg-green-100 rounded-full">
                You
              </span>
            </div>
          );
        }
        
        return (
          <div className="flex justify-end">
            {isFriend ? (
              <Button
                variant="outline"
                onClick={() => dropfriend(username)}
                size="sm"
              >
                Remove Friend
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => addfriend(username)}
                size="sm"
              >
                Add Friend
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours().toString().padStart(2, "0");
    var min = a.getMinutes().toString().padStart(2, "0");
    var sec = a.getSeconds().toString().padStart(2, "0");
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }
  
  return (
    <div
      className="h-full px-1.5 py-1"
      style={{
        width:
          open && !isMobile
            ? "calc(100vw - var(--sidebar-width))"
            : "100vw",
      }}
    >
      {/* Logged in User Info Card - Always at top */}
      {loggedInUser && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 ring-2 ring-green-500">
                <AvatarImage src={loggedInUser.avatar} alt={loggedInUser.username} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-green-600" />
                  <h3 className="text-xl font-bold text-gray-800">
                    {loggedInUser.username}
                  </h3>
                  <span className="px-2 py-1 text-sm bg-green-100 text-green-800 rounded-full">
                    You
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex flex-col">
                    <span className="font-medium">Current Rating</span>
                    <span className="text-lg font-bold text-green-700">{loggedInUser.rating}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Max Rating</span>
                    <span className="text-lg font-bold text-blue-700">{loggedInUser.max_rating}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Problems Solved</span>
                    <span className="text-lg font-bold text-purple-700">{loggedInUser.total_solved}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">Friends</span>
                    <span className="text-lg font-bold text-amber-700">{codeforcesfriends.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              asChild
              className="border-green-300 hover:bg-green-50"
            >
              <a
                href={`https://codeforces.com/profile/${loggedInUser.username}`}
                target="_blank"
                rel="noreferrer"
              >
                View Profile
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex mb-4 border-b">
        <Button
          variant={activeTab === "friends" ? "default" : "ghost"}
          className={`rounded-none border-b-2 ${activeTab === "friends" ? "border-primary" : "border-transparent"}`}
          onClick={() => setActiveTab("friends")}
        >
          <Users className="h-4 w-4 mr-2" />
          Friends Leaderboard
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            {codeforcesfriends.length + (loggedInUser ? 1 : 0)}
          </span>
        </Button>
        <Button
          variant={activeTab === "contest" ? "default" : "ghost"}
          className={`rounded-none border-b-2 ${activeTab === "contest" ? "border-primary" : "border-transparent"}`}
          onClick={() => setActiveTab("contest")}
        >
          <Trophy className="h-4 w-4 mr-2" />
          Contest Standings
        </Button>
      </div>

      {/* Friends Tab Content */}
      {activeTab === "friends" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Friends Leaderboard</h3>
              <span className="text-sm text-gray-500">
                {/* TODO: Sort by rating when backend is implemented */}
                Sorted by rating
              </span>
            </div>
            
            <div className="w-1/3">
              <Input
                placeholder="Search friends..."
                value={searchfield}
                onChange={(e) => setSearchfield(e.target.value)}
                type="search"
                className="bg-white"
              />
            </div>
          </div>

          {loadingUser ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading user data...</span>
            </div>
          ) : filteredusers.length > 0 ? (
            <>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      Showing {filteredusers.length} {filteredusers.length === 1 ? 'user' : 'users'}
                      {loggedInUser && " (including you)"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    TODO: Implement rating-based sorting from backend
                  </div>
                </div>
              </div>
              <DataTable
                data={filteredusers}
                columns={columns}
              />
            </>
          ) : (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Friends Yet</h3>
              <p className="text-gray-500 mb-4">
                {loggedInUser ? `${loggedInUser.username}, you don't have any Codeforces friends yet.` : "Add friends to see them here"}
              </p>
              <div className="text-sm text-gray-400">
                <p>Click Add Friend on any user in the main leaderboard</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contest Tab Content */}
      {activeTab === "contest" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Contest Standings</h3>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter Contest ID (e.g. 1902)"
                  className="w-64"
                  value={contestId}
                  onChange={(e) => setContestId(e.target.value)}
                  type="number"
                  min="1"
                />
                <Button 
                  onClick={fetchContestStandings}
                  disabled={loadingContest || !contestId}
                  className="whitespace-nowrap"
                >
                  {loadingContest ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search Contest
                </Button>
              </div>
              {contestLoaded && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Show Friends Only</span>
                  <Switch
                    checked={showFriendsInContest}
                    onCheckedChange={setShowFriendsInContest}
                  />
                </div>
              )}
            </div>
          </div>

          {contestError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{contestError}</p>
              <Button 
                onClick={fetchContestStandings}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          )}

          {loadingContest ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading contest standings...</span>
            </div>
          ) : contestLoaded && filteredContestStandings.length > 0 ? (
            <>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">
                      {contestName ? contestName : `Contest ${contestId}`}
                    </h4>
                    {contestName && (
                      <p className="text-sm text-gray-600">
                        Contest ID: {contestId}
                      </p>
                    )}
                    {showFriendsInContest && (
                      <p className="text-sm text-blue-600 mt-1">
                        Showing {filteredContestStandings.length} {filteredContestStandings.length === 1 ? 'friend' : 'friends'} in this contest
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Participants</p>
                    <p className="text-2xl font-bold text-blue-600">{contestStandings.length}</p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-2">
                {showFriendsInContest 
                  ? `Showing ${filteredContestStandings.length} friends in contest` 
                  : `Showing top ${Math.min(filteredContestStandings.length, 200)} participants`}
              </div>
              
              <DataTable
                data={filteredContestStandings.sort((a, b) => a.rank - b.rank)}
                columns={contestColumns}
              />
            </>
          ) : contestId && !contestLoaded ? (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Search for Contest</h3>
              <p className="text-gray-500 mb-4">
                Enter a contest ID above and click Search Contest to view standings
              </p>
              <div className="text-sm text-gray-400">
                <p>Try these recent contests:</p>
                <div className="flex gap-4 mt-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setContestId("1902");
                      fetchContestStandings();
                    }}
                  >
                    1902 (Div. 3)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setContestId("1907");
                      fetchContestStandings();
                    }}
                  >
                    1907 (Div. 2)
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setContestId("1073");
                      fetchContestStandings();
                    }}
                  >
                    1073 (Educational)
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <Trophy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Find Contest Standings</h3>
              <p className="text-gray-500 mb-4">
                Enter a Codeforces contest ID to view the standings
              </p>
              <div className="text-sm text-gray-400 max-w-md mx-auto">
                <p className="mb-2">Examples:</p>
                <ul className="space-y-1">
                  <li>• <strong>1902</strong> - Codeforces Round 1902 (Div. 3)</li>
                  <li>• <strong>1907</strong> - Codeforces Round 1907 (Div. 2)</li>
                  <li>• <strong>1073</strong> - Educational Codeforces Round 53</li>
                  <li>• <strong>1914</strong> - Codeforces Round 1914 (Div. 3)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}