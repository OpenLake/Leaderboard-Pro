import React, { useEffect, useState } from "react";
import { useAuth } from "@/Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, UserPlus, Users, Shield } from "lucide-react";
import {
  fetchOrganizations,
  createOrganization,
  joinOrganization,
  fetchPublicOrganizations,
  joinPublicGroup,
} from "@/utils/api_organizations";
import { CreateGroupModal, JoinGroupModal } from "./OrganizationsModals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Globe } from "lucide-react";

const Organizations = () => {
  const { authTokens, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [publicOrganizations, setPublicOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("my-groups");

  useEffect(() => {
    if (isAuthenticated) {
      loadOrganizations();
      loadPublicOrganizations();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, authTokens]);

  const loadOrganizations = async () => {
    if (!isAuthenticated || !authTokens?.access) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchOrganizations(authTokens);
      setOrganizations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading organizations:", error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPublicOrganizations = async () => {
    try {
      const data = await fetchPublicOrganizations(authTokens);
      setPublicOrganizations(data);
    } catch (error) {
      console.error("Error loading public organizations:", error);
    }
  };

  const handleCreate = async (data) => {
    try {
      await createOrganization(authTokens, data);
      loadOrganizations();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleJoin = async (joinCode) => {
    try {
      await joinOrganization(authTokens, joinCode);
      loadOrganizations();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleJoinPublic = async (orgId) => {
    try {
      await joinPublicGroup(authTokens, orgId);
      loadOrganizations();
      loadPublicOrganizations();
    } catch (error) {
      alert(error.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="bg-blue-100 dark:bg-blue-900/20 p-6 rounded-full">
          <Shield className="h-12 w-12 text-blue-600" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-3xl font-bold">Join the Community</h2>
          <p className="text-muted-foreground">
            Log in to create or join campus leaderboards and compete with your
            peers.
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/login")} size="lg">
            Log In
          </Button>
          <Button
            onClick={() => navigate("/register")}
            variant="outline"
            size="lg"
          >
            Create Account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="text-muted-foreground">
            Manage your campus and club leaderboards.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsJoinModalOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Join Group
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Group
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 p-1 bg-muted/50 w-full max-w-md">
          <TabsTrigger value="my-groups" className="flex-1 gap-2">
            <Users className="h-4 w-4" />
            My Groups ({organizations.length})
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex-1 gap-2">
            <Globe className="h-4 w-4" />
            Discover Groups ({publicOrganizations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-groups">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse h-48" />
              ))}
            </div>
          ) : organizations.length === 0 ? (
            <Card className="border-dashed border-2 flex flex-col items-center justify-center py-20 bg-muted/20">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold mb-2">No groups yet</p>
              <p className="text-muted-foreground mb-6">
                Join an existing group or create a new one to get started.
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Start a Group
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organizations.map((org) => (
                <Card
                  key={org.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group border-primary/10"
                  onClick={() => navigate(`/organizations/${org.id}`)}
                >
                  <CardHeader className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      {org.name}
                      <span className="text-xs font-normal bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded-full">
                        {org.member_count} members
                      </span>
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {org.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-center text-sm text-muted-foreground justify-between">
                      <span className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                          <Plus className="h-3 w-3 text-primary" />
                        </div>
                        {org.admin_username}
                      </span>
                      {org.join_code && (
                        <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-1 rounded tracking-wider">
                          Code: {org.join_code}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="discover">
          {publicOrganizations.length === 0 ? (
            <Card className="border-dashed border-2 flex flex-col items-center justify-center py-20 bg-muted/20">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold mb-2">No new public groups</p>
              <p className="text-muted-foreground mb-6">
                There are currently no new public groups to join.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicOrganizations.map((org) => (
                <Card
                  key={org.id}
                  className="hover:shadow-lg transition-shadow overflow-hidden group"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {org.name}
                      <span className="text-xs font-normal bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-1 rounded-full">
                        {org.member_count} members
                      </span>
                    </CardTitle>
                    <CardDescription className="line-clamp-2 italic">
                      {org.description || "A public learning community."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Public Group
                      </span>
                      <Button 
                        size="sm" 
                        variant="default" 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleJoinPublic(org.id)}
                      >
                        Join Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateGroupModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
      <JoinGroupModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoin={handleJoin}
      />
    </div>
  );
};

export default Organizations;
