import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/Context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, Trophy, LogOut, UserMinus, User, Users, Check, Copy } from "lucide-react";
import { 
  fetchOrgLeaderboard, 
  fetchOrganizationDetails, 
  leaveOrganization, 
  removeMember, 
  fetchOrganizationMembers 
} from "@/utils/api_organizations";
import { CFTable } from "./CodeforcesTable";
import { CCTable } from "./CodechefTable";
import { LCTable } from "./LeetcodeTable";
import { AtcoderTable } from "./AtcoderTable";
import { GHTable } from "./GithubTable";
import { OpenLakeTable } from "./OpenlakeTable";


const OrganizationLeaderboard = () => {
  const { id } = useParams();
  const { authTokens } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [activePlatform, setActivePlatform] = useState("codeforces");
  const [orgDetails, setOrgDetails] = useState(null);
  const [members, setMembers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const platforms = [
    { id: "codeforces", name: "Codeforces", component: CFTable, propName: "codeforcesUsers" },
    { id: "codechef", name: "Codechef", component: CCTable, propName: "codechefUsers" },
    { id: "leetcode", name: "LeetCode", component: LCTable, propName: "leetcodeUsers" },
    { id: "atcoder", name: "AtCoder", component: AtcoderTable, propName: "atcoderUsers" },
    { id: "github", name: "GitHub", component: GHTable, propName: "githubUsers" },
    { id: "openlake", name: "OpenLake", component: OpenLakeTable, propName: "OLUsers" },
  ];

  useEffect(() => {
    loadOrgDetails();
    if (activePlatform === "members") {
      loadMembers();
    } else {
      loadLeaderboard(activePlatform);
    }
  }, [id, activePlatform, authTokens]);

  const loadOrgDetails = async () => {
    try {
      const details = await fetchOrganizationDetails(authTokens, id);
      setOrgDetails(details);
    } catch (error) {
      console.error("Failed to fetch org details:", error);
    }
  };

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await fetchOrganizationMembers(authTokens, id);
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (platform) => {
    try {
      setLoading(true);
      const result = await fetchOrgLeaderboard(authTokens, id, platform);
      setData(result);
    } catch (error) {
      console.error("Failed to load leaderboard:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this group?")) return;
    try {
      setIsLeaving(true);
      await leaveOrganization(authTokens, id);
      navigate("/organizations");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLeaving(false);
    }
  };

  const handleRemoveMember = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to remove ${username} from the group?`)) return;
    try {
      await removeMember(authTokens, id, userId);
      loadMembers();
    } catch (error) {
      alert(error.message);
    }
  };

  const activePlatformInfo = platforms.find(p => p.id === activePlatform);

  return (
    <div className="p-6 lg:p-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/organizations")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              {orgDetails?.name || "Group Leaderboard"}
            </h1>
            {orgDetails?.description && (
              <p className="text-muted-foreground mt-1">{orgDetails.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {orgDetails?.join_code && (
            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg border border-dashed border-primary/30">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Join Code</span>
                <code className="text-lg font-mono font-bold text-primary">{orgDetails.join_code}</code>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => {
                  navigator.clipboard.writeText(orgDetails.join_code);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          )}
          
          <Button 
            variant="destructive" 
            size="sm" 
            className="gap-2"
            disabled={isLeaving}
            onClick={handleLeave}
          >
            <LogOut className="h-4 w-4" />
            Leave Group
          </Button>
        </div>
      </div>

      <Tabs defaultValue="codeforces" value={activePlatform} onValueChange={setActivePlatform} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto p-1 bg-muted/50">
          <TabsTrigger value="codeforces" className="py-2">Codeforces</TabsTrigger>
          <TabsTrigger value="codechef" className="py-2">Codechef</TabsTrigger>
          <TabsTrigger value="leetcode" className="py-2">LeetCode</TabsTrigger>
          <TabsTrigger value="atcoder" className="py-2">AtCoder</TabsTrigger>
          <TabsTrigger value="github" className="py-2">GitHub</TabsTrigger>
          <TabsTrigger value="openlake" className="py-2">OpenLake</TabsTrigger>
          <TabsTrigger value="members" className="py-2 font-semibold">
            <Users className="h-3 w-3 mr-1" />
            Members
          </TabsTrigger>
        </TabsList>
        
        {platforms.map(p => (
          <TabsContent key={p.id} value={p.id} className="mt-6 bg-card border rounded-xl overflow-hidden shadow-sm">
            {loading ? (
             <div className="h-96 flex flex-col items-center justify-center gap-4">
               <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
               <p className="text-muted-foreground animate-pulse">Fetching member rankings...</p>
             </div>
            ) : (
              activePlatformInfo && (
                <activePlatformInfo.component 
                  {...{ [activePlatformInfo.propName]: data }} 
                />
              )
            )}
          </TabsContent>
        ))}

        <TabsContent value="members" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="h-5 w-5" />
                Group Members ({members.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {members.map((member) => (
                  <div key={member.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{member.username}</p>
                        <p className="text-xs text-muted-foreground">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                      </div>
                      {orgDetails?.admin_username === member.username && (
                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ml-2">
                          Admin
                        </span>
                      )}
                    </div>
                    
                    {orgDetails?.is_admin && orgDetails?.admin_username !== member.username && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:bg-destructive/10 gap-2"
                        onClick={() => handleRemoveMember(member.user, member.username)}
                      >
                        <UserMinus className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationLeaderboard;
