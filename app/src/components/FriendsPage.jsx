import { useEffect, useMemo, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/Context/AuthContext";

const BACKEND = import.meta.env.VITE_BACKEND;

const PLATFORM_CONFIG = [
  {
    key: "codeforces",
    title: "Codeforces",
    endpoint: "/codeforcesFL/",
    removeEndpoint: "/codeforcesFD/",
    profile: (username) => `https://codeforces.com/profile/${username}`,
    rankLabel: "Rating Rank",
    metricLabel: "Rating",
    metricValue: (user) => user.rating ?? 0,
    details: (user) => `Max ${user.max_rating ?? 0} | Solved ${user.total_solved ?? 0}`,
    sortUsers: (users) =>
      [...users].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
  },
  {
    key: "codechef",
    title: "CodeChef",
    endpoint: "/codechefFL/",
    removeEndpoint: "/codechefFD/",
    profile: (username) => `https://www.codechef.com/users/${username}`,
    rankLabel: "Rating Rank",
    metricLabel: "Rating",
    metricValue: (user) => user.rating ?? 0,
    details: (user) =>
      `Global ${user.Global_rank ?? "N/A"} | Country ${user.Country_rank ?? "N/A"}`,
    sortUsers: (users) =>
      [...users].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
  },
  {
    key: "leetcode",
    title: "LeetCode",
    endpoint: "/leetcodeFL/",
    removeEndpoint: "/leetcodeFD/",
    profile: (username) => `https://leetcode.com/u/${username}`,
    rankLabel: "Global Rank",
    metricLabel: "Solved",
    metricValue: (user) => user.total_solved ?? 0,
    details: (user) => `Platform rank ${user.ranking ?? "N/A"}`,
    sortUsers: (users) =>
      [...users].sort((a, b) => (a.ranking ?? Infinity) - (b.ranking ?? Infinity)),
  },
  {
    key: "github",
    title: "GitHub",
    endpoint: "/githubFL/",
    removeEndpoint: "/githubFD/",
    profile: (username) => `https://github.com/${username}`,
    rankLabel: "Contribution Rank",
    metricLabel: "Contributions",
    metricValue: (user) => user.contributions ?? 0,
    details: (user) => `Repos ${user.repositories ?? 0} | Stars ${user.stars ?? 0}`,
    sortUsers: (users) =>
      [...users].sort((a, b) => (b.contributions ?? 0) - (a.contributions ?? 0)),
  },
  {
    key: "openlake",
    title: "OpenLake",
    endpoint: "/openlakeFL/",
    removeEndpoint: "/openlakeFD/",
    profile: (username) => `https://github.com/${username}`,
    rankLabel: "Contribution Rank",
    metricLabel: "Contributions",
    metricValue: (user) => user.contributions ?? 0,
    details: () => "OpenLake contributors leaderboard",
    sortUsers: (users) =>
      [...users].sort((a, b) => (b.contributions ?? 0) - (a.contributions ?? 0)),
  },
];

const readJsonIfAvailable = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    const fallbackText = await response.text();
    return {
      isJson: false,
      data: null,
      message: fallbackText || `Unexpected response (${response.status})`,
    };
  }

  try {
    const data = await response.json();
    return { isJson: true, data, message: null };
  } catch {
    return { isJson: false, data: null, message: "Invalid JSON response" };
  }
};

const mapFromUsers = (users) =>
  new Map((Array.isArray(users) ? users : []).map((user) => [user.username, user]));

const findPlatformFriends = (friendNames, users, sortUsers) => {
  const usersMap = mapFromUsers(users);
  const sorted = sortUsers(Array.isArray(users) ? users : []);
  const rankingMap = new Map();
  sorted.forEach((user, idx) => {
    rankingMap.set(user.username, idx + 1);
  });

  return friendNames
    .map((name) => usersMap.get(name))
    .filter(Boolean)
    .map((user) => ({
      ...user,
      rank: rankingMap.get(user.username) ?? null,
    }));
};

export default function FriendsPage({
  codeforcesUsers,
  codechefUsers,
  leetcodeUsers,
  githubUsers,
  openlakeUsers,
}) {
  const { open, isMobile } = useSidebar();
  const { userNames, authTokens } = useAuth();
  const [friendsByPlatform, setFriendsByPlatform] = useState({
    codeforces: [],
    codechef: [],
    leetcode: [],
    github: [],
    openlake: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const accessToken = authTokens?.access || null;
  const isAuthenticated = Boolean(accessToken);

  const refreshFriends = async () => {
    if (!accessToken) {
      setFriendsByPlatform({
        codeforces: [],
        codechef: [],
        leetcode: [],
        github: [],
        openlake: [],
      });
      return;
    }

    setLoading(true);
    setError("");
    try {
      const responses = await Promise.allSettled(
        PLATFORM_CONFIG.map((platform) =>
          fetch(BACKEND + platform.endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
          }),
        ),
      );

      const parsed = await Promise.all(
        responses.map(async (responseResult) => {
          if (responseResult.status !== "fulfilled") {
            return null;
          }
          return readJsonIfAvailable(responseResult.value);
        }),
      );

      const nextState = {
        codeforces: [],
        codechef: [],
        leetcode: [],
        github: [],
        openlake: [],
      };

      PLATFORM_CONFIG.forEach((platform, idx) => {
        const responseResult = responses[idx];
        const result = parsed[idx];
        if (responseResult.status !== "fulfilled" || !result) {
          nextState[platform.key] = [];
          return;
        }
        const response = responseResult.value;
        nextState[platform.key] =
          response.ok && result.isJson && Array.isArray(result.data)
            ? result.data
            : [];
      });

      setFriendsByPlatform(nextState);
    } catch {
      setError("Unable to load friends right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFriends();
  }, [isAuthenticated]);

  const platformFriendRows = useMemo(
    () => ({
      codeforces: findPlatformFriends(
        friendsByPlatform.codeforces,
        codeforcesUsers,
        PLATFORM_CONFIG[0].sortUsers,
      ),
      codechef: findPlatformFriends(
        friendsByPlatform.codechef,
        codechefUsers,
        PLATFORM_CONFIG[1].sortUsers,
      ),
      leetcode: findPlatformFriends(
        friendsByPlatform.leetcode,
        leetcodeUsers,
        PLATFORM_CONFIG[2].sortUsers,
      ),
      github: findPlatformFriends(
        friendsByPlatform.github,
        githubUsers,
        PLATFORM_CONFIG[3].sortUsers,
      ),
      openlake: findPlatformFriends(
        friendsByPlatform.openlake,
        openlakeUsers,
        PLATFORM_CONFIG[4].sortUsers,
      ),
    }),
    [friendsByPlatform, codeforcesUsers, codechefUsers, leetcodeUsers, githubUsers, openlakeUsers],
  );

  const removeFriend = async (platformKey, username) => {
    if (!accessToken) {
      return;
    }
    const platform = PLATFORM_CONFIG.find((item) => item.key === platformKey);
    if (!platform) {
      return;
    }

    const response = await fetch(BACKEND + platform.removeEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify({ friendName: username }),
    });
    if (!response.ok) {
      alert("Could not remove friend. Please try again.");
      return;
    }

    setFriendsByPlatform((current) => ({
      ...current,
      [platformKey]: current[platformKey].filter((friend) => friend !== username),
    }));
  };

  return (
    <div
      className="text-foreground flex h-[100%] flex-col gap-5 px-10"
      style={{
        width:
          open && !isMobile
            ? "calc(100vw - var(--sidebar-width))"
            : "100vw",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-semibold">Friends</div>
          <p className="mt-1 text-muted-foreground">
            {userNames?.username
              ? `${userNames.username}, manage your friends across all leaderboards.`
              : "Manage your friends across all leaderboards."}
          </p>
        </div>
        <Button variant="outline" onClick={refreshFriends} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {error ? (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {PLATFORM_CONFIG.map((platform) => {
        const rows = platformFriendRows[platform.key] || [];
        return (
          <section key={platform.key} className="rounded-lg border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{platform.title}</h2>
              <span className="text-sm text-muted-foreground">
                {rows.length} friend{rows.length === 1 ? "" : "s"}
              </span>
            </div>

            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No friends added on {platform.title} yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-2 pr-3">{platform.rankLabel}</th>
                      <th className="py-2 pr-3">Username</th>
                      <th className="py-2 pr-3">{platform.metricLabel}</th>
                      <th className="py-2 pr-3">Details</th>
                      <th className="py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((user) => (
                      <tr key={`${platform.key}-${user.username}`} className="border-b last:border-0">
                        <td className="py-2 pr-3">#{user.rank ?? "N/A"}</td>
                        <td className="py-2 pr-3">
                          <a
                            className="font-medium hover:underline"
                            href={platform.profile(user.username)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {user.username}
                          </a>
                        </td>
                        <td className="py-2 pr-3">{platform.metricValue(user)}</td>
                        <td className="py-2 pr-3 text-muted-foreground">
                          {platform.details(user)}
                        </td>
                        <td className="py-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFriend(platform.key, user.username)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
