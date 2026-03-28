import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User, Trophy, Medal } from "lucide-react";

const BACKEND = import.meta.env.VITE_BACKEND;

// safe token getter — won't crash if storage is cleared mid-session
const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("authTokens"))?.access ?? "";
  } catch {
    return "";
  }
};

// ── tiny horizontal progress bar ─────────────────────────────────────────────
function ScoreBar({ value = 0, color }) {
  const pct = Math.min(100, Math.max(0, value * 100));
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-right text-xs tabular-nums opacity-80">
        {value.toFixed(3)}
      </span>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ── gold / silver / bronze badge, plain number otherwise ─────────────────────
function RankBadge({ rank }) {
  if (rank === 1)
    return (
      <span className="inline-flex items-center gap-1 font-bold text-yellow-400">
        <Trophy className="h-4 w-4" /> 1
      </span>
    );
  if (rank === 2)
    return (
      <span className="inline-flex items-center gap-1 font-bold text-slate-300">
        <Medal className="h-4 w-4" /> 2
      </span>
    );
  if (rank === 3)
    return (
      <span className="inline-flex items-center gap-1 font-bold text-amber-600">
        <Medal className="h-4 w-4" /> 3
      </span>
    );
  return <span className="tabular-nums">{rank}</span>;
}

// ── skeleton placeholder while loading ───────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="space-y-3 pt-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-2">
          <Skeleton className="h-8 w-8 rounded-full shrink-0" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20 ml-auto" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}

// ── main exported component ───────────────────────────────────────────────────
export function UnifiedLeaderboard() {
  const { open, isMobile } = useSidebar();

  const [allUsers, setAllUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showFriends, setShowFriends] = useState(false);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── 1. fetch unified analytics ranking ─────────────────────────────────────
  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!BACKEND) {
          throw new Error("Backend URL is not configured.");
        }
        const token = getToken();
        const res = await fetch(BACKEND + "/analytics/unified/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        // rank field comes as float from pandas — sort ascending
        const sorted = [...data].sort((a, b) => a.rank - b.rank);
        setAllUsers(sorted);
      } catch (err) {
        console.error("Unified leaderboard error:", err);
        setError("Failed to load unified rankings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  // ── 2. fetch github friend list (used as proxy for unified friends) ─────────
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        if (!BACKEND) {
          setFriends([]);
          return;
        }
        const token = getToken();
        const res = await fetch(BACKEND + "/githubFL/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!res.ok) {
          console.error("Failed to fetch friends:", res.status, res.statusText);
          setFriends([]);
          return;
        }
        const data = await res.json();
        setFriends(Array.isArray(data) ? data : []);
      } catch {
        setFriends([]);
      }
    };
    fetchFriends();
  }, []);

  // ── 3. friends toggle filter ────────────────────────────────────────────────
  useEffect(() => {
    setDisplayUsers(
      showFriends
        ? allUsers.filter((u) => {
            const candidates = [u.gh_uname, u.username]
              .filter(Boolean)
              .map((value) => value.toLowerCase());
            return friends.some((friend) =>
              candidates.includes(String(friend).toLowerCase()),
            );
          })
        : allUsers,
    );
  }, [showFriends, friends, allUsers]);

  // ── 4. search filter ────────────────────────────────────────────────────────
  useEffect(() => {
    if (search.trim() === "") {
      setFiltered(displayUsers);
    } else {
      setFiltered(
        displayUsers.filter((u) =>
          u.username.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    }
  }, [search, displayUsers]);

  // ── column definitions ──────────────────────────────────────────────────────
  const columns = [
    {
      accessorKey: "rank",
      header: "Rank",
      cell: ({ row }) => (
        <RankBadge rank={Math.round(row.getValue("rank"))} />
      ),
    },
    {
      id: "avatar",
      header: "Avatar",
      cell: ({ row }) => (
        <Avatar>
          {/* avatar field may not be present in unified data — graceful fallback */}
          <AvatarImage src={row.original.avatar ?? ""} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("username")}</span>
      ),
    },
    {
      accessorKey: "github_score",
      header: () => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help underline decoration-dotted">
              GitHub
            </span>
          </TooltipTrigger>
          <TooltipContent>
            30% repos · 40% stars · 30% contributions
          </TooltipContent>
        </Tooltip>
      ),
      cell: ({ row }) => (
        <ScoreBar value={row.getValue("github_score") ?? 0} color="#4ade80" />
      ),
    },
    {
      accessorKey: "cf_score",
      header: () => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help underline decoration-dotted">
              Codeforces
            </span>
          </TooltipTrigger>
          <TooltipContent>
            40% rating · 20% max rating · 20% solved · 20% efficiency
          </TooltipContent>
        </Tooltip>
      ),
      cell: ({ row }) => (
        <ScoreBar value={row.getValue("cf_score") ?? 0} color="#60a5fa" />
      ),
    },
    {
      accessorKey: "cc_score",
      header: () => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help underline decoration-dotted">
              CodeChef
            </span>
          </TooltipTrigger>
          <TooltipContent>
            50% rating · 30% max rating · 20% global rank
          </TooltipContent>
        </Tooltip>
      ),
      cell: ({ row }) => (
        <ScoreBar value={row.getValue("cc_score") ?? 0} color="#fb923c" />
      ),
    },
    {
      accessorKey: "lt_score",
      header: () => (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help underline decoration-dotted">
              LeetCode
            </span>
          </TooltipTrigger>
          <TooltipContent>
            40% difficulty-weighted · 30% total solved · 30% ranking
          </TooltipContent>
        </Tooltip>
      ),
      cell: ({ row }) => (
        <ScoreBar value={row.getValue("lt_score") ?? 0} color="#facc15" />
      ),
    },
    {
      accessorKey: "total_score",
      header: "Total Score",
      cell: ({ row }) => (
        <span className="font-semibold tabular-nums">
          {(row.getValue("total_score") ?? 0).toFixed(3)}
        </span>
      ),
    },
  ];

  // ── render ──────────────────────────────────────────────────────────────────
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
      {/* page header */}
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-xl font-bold">Unified Leaderboard</h2>
        <p className="text-sm text-muted-foreground">
          Combined ranking across GitHub, Codeforces, CodeChef &amp; LeetCode.
          Hover column headers to see score weights.
        </p>
      </div>

      {/* toolbar: search + friends toggle */}
      <div className="mb-3 flex flex-row items-center justify-between">
        <Input
          placeholder="Search users..."
          className="w-[40%]"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2 text-sm">
          Friends Only
          <Switch
            className="mx-1 align-middle"
            onCheckedChange={(val) => setShowFriends(val)}
          />
        </div>
      </div>

      {/* content */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-destructive">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      ) : (
        <DataTable data={filtered} columns={columns} />
      )}
    </div>
  );
}
