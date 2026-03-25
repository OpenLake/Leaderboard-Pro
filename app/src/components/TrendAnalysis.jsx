import { useEffect, useState, useCallback } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useTheme } from "@/Context/ThemeProvider";
import { useAuth } from "@/Context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Chart from "react-apexcharts";
import { ChevronLeft, ChevronRight, TrendingUp, Activity, BarChart2 } from "lucide-react";

const BACKEND = import.meta.env.VITE_BACKEND;

// ── safe token getter ─────────────────────────────────────────────────────────
const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem("authTokens"))?.access ?? "";
  } catch {
    return "";
  }
};

// ── fetch helper ──────────────────────────────────────────────────────────────
const fetchTrend = async (url) => {
  const token = getToken();
  const res = await fetch(BACKEND + url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// ── skeleton loader ───────────────────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div className="space-y-3 p-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-[280px] w-full rounded-xl" />
    </div>
  );
}

// ── error state ───────────────────────────────────────────────────────────────
function ChartError({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <p className="text-destructive text-sm">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

// ── monthly heatmap component ─────────────────────────────────────────────────
function MonthlyHeatmap({ data, type, loading, error, onRetry }) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const canGoNext = currentDate < new Date(today.getFullYear(), today.getMonth(), 1);

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    if (canGoNext) {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };

  const monthLabel = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Filter data for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun

  // Build lookup from data
  const dataMap = {};
  if (data) {
    const arr = data.heatmap || [];
    arr.forEach((item) => {
      dataMap[item.date] = item;
    });
  }

  // Get color for a cell based on type
  const getCellColor = (dateStr) => {
    const item = dataMap[dateStr];
    if (!item) return "bg-muted opacity-30";

    if (type === "leetcode") {
      const count = item.count ?? 0;
      if (count === 0) return "bg-muted opacity-30";
      if (count <= 2) return "bg-yellow-200 dark:bg-yellow-900";
      if (count <= 5) return "bg-yellow-400 dark:bg-yellow-600";
      if (count <= 9) return "bg-yellow-500 dark:bg-yellow-500";
      return "bg-yellow-600 dark:bg-yellow-400";
    }

    if (type === "codeforces") {
      const change = item.rating_change ?? 0;
      if (change === 0) return "bg-muted opacity-30";
      if (change > 0) {
        if (change <= 25) return "bg-green-200 dark:bg-green-900";
        if (change <= 50) return "bg-green-400 dark:bg-green-700";
        if (change <= 100) return "bg-green-500 dark:bg-green-600";
        return "bg-green-600 dark:bg-green-500";
      } else {
        if (change >= -25) return "bg-red-200 dark:bg-red-900";
        if (change >= -50) return "bg-red-400 dark:bg-red-700";
        if (change >= -100) return "bg-red-500 dark:bg-red-600";
        return "bg-red-600 dark:bg-red-500";
      }
    }

    if (type === "unified") {
      const change = item.score_change ?? 0;
      if (change === 0) return "bg-muted opacity-30";
      if (change > 0) {
        if (change <= 0.01) return "bg-green-200 dark:bg-green-900";
        if (change <= 0.05) return "bg-green-400 dark:bg-green-700";
        if (change <= 0.1) return "bg-green-500 dark:bg-green-600";
        return "bg-green-600 dark:bg-green-500";
      } else {
        if (change >= -0.01) return "bg-red-200 dark:bg-red-900";
        if (change >= -0.05) return "bg-red-400 dark:bg-red-700";
        if (change >= -0.1) return "bg-red-500 dark:bg-red-600";
        return "bg-red-600 dark:bg-red-500";
      }
    }

    return "bg-muted opacity-30";
  };

  // Get tooltip text for a cell
  const getTooltip = (dateStr) => {
    const item = dataMap[dateStr];
    if (!item) return "No data";

    if (type === "leetcode") {
      const count = item.count ?? 0;
      return count === 0 ? "No submissions" : `${count} submission${count > 1 ? "s" : ""}`;
    }
    if (type === "codeforces") {
      const change = item.rating_change ?? 0;
      if (!item.contest) return "No contest";
      return `${item.contest} | ${change > 0 ? "+" : ""}${change} (${item.old_rating} → ${item.new_rating})`;
    }
    if (type === "unified") {
      const change = item.score_change ?? 0;
      const total = item.total_score ?? 0;
      return `Score: ${total.toFixed(4)} | Change: ${change > 0 ? "+" : ""}${change.toFixed(4)}`;
    }
    return "No data";
  };

  // Build grid cells
  const cells = [];
  // empty cells before first day (Sunday=0 offset)
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(<div key={`empty-${i}`} className="h-8 w-8" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const item = dataMap[dateStr];
    const color = getCellColor(dateStr);
    const tooltip = getTooltip(dateStr);

    // Get value to display
    let value = "";
    if (item) {
      if (type === "leetcode") value = item.count > 0 ? item.count : "";
      if (type === "codeforces") value = item.rating_change !== 0 ? (item.rating_change > 0 ? `+${item.rating_change}` : item.rating_change) : "";
      if (type === "unified") value = item.score_change !== 0 ? (item.score_change > 0 ? `+${item.score_change.toFixed(2)}` : item.score_change.toFixed(2)) : "";
    }

    cells.push(
      <div
        key={dateStr}
        className={`h-8 w-8 rounded-md flex items-center justify-center cursor-help transition-transform hover:scale-110 ${color}`}
        title={`${dateStr}: ${tooltip}`}
      >
        <span className="text-[9px] font-medium leading-none text-foreground/70">
          {value}
        </span>
      </div>
    );
  }

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) return <ChartSkeleton />;
  if (error) return <ChartError message={error} onRetry={onRetry} />;

  return (
    <div className="space-y-3">
      {/* navigation header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={goToPrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-semibold">{monthLabel}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          disabled={!canGoNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* day labels */}
      <div className="grid grid-cols-7 gap-1">
        {dayLabels.map((d) => (
          <div key={d} className="h-6 flex items-center justify-center">
            <span className="text-[10px] text-muted-foreground font-medium">{d}</span>
          </div>
        ))}
        {cells.map((cell) => (
          <div key={cell.key} className="flex items-center justify-center">
            {cell}
          </div>
        ))}
      </div>

      {/* legend */}
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        {type === "leetcode" && (
          <>
            <span>Less</span>
            <div className="h-3 w-3 rounded-sm bg-yellow-200 dark:bg-yellow-900" />
            <div className="h-3 w-3 rounded-sm bg-yellow-400 dark:bg-yellow-600" />
            <div className="h-3 w-3 rounded-sm bg-yellow-500" />
            <div className="h-3 w-3 rounded-sm bg-yellow-600 dark:bg-yellow-400" />
            <span>More</span>
          </>
        )}
        {(type === "codeforces" || type === "unified") && (
          <>
            <div className="h-3 w-3 rounded-sm bg-green-600 dark:bg-green-500" />
            <span>Gained</span>
            <div className="h-3 w-3 rounded-sm bg-muted opacity-50" />
            <span>No activity</span>
            <div className="h-3 w-3 rounded-sm bg-red-600 dark:bg-red-500" />
            <span>Lost</span>
          </>
        )}
      </div>
    </div>
  );
}

// ── LeetCode line chart ───────────────────────────────────────────────────────
function LeetCodeLineChart({ data, loading, error, onRetry, darkmode }) {
  if (loading) return <ChartSkeleton />;
  if (error) return <ChartError message={error} onRetry={onRetry} />;
  if (!data) return null;

  const { easy, medium, hard, total } = data.current_totals;

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      foreColor: darkmode ? "#e5e7eb" : "#374151",
    },
    theme: { mode: darkmode ? "dark" : "light" },
    plotOptions: {
      bar: { borderRadius: 5, distributed: true, columnWidth: "50%" },
    },
    colors: ["#4ade80", "#facc15", "#f87171"],
    dataLabels: {
      enabled: true,
      formatter: (val) => val,
      style: { fontSize: "12px" },
    },
    legend: { show: false },
    xaxis: {
      categories: ["Easy", "Medium", "Hard"],
      labels: { style: { fontSize: "13px", fontWeight: 600 } },
    },
    yaxis: { title: { text: "Problems Solved" } },
    tooltip: {
      y: { formatter: (val) => `${val} solved` },
    },
    annotations: {
      yaxis: [{
        y: 0,
        label: {
          text: `Total: ${total}`,
          style: { color: "#fff", background: "#6366f1" },
        },
      }],
    },
    grid: { borderColor: darkmode ? "#374151" : "#e5e7eb" },
  };

  const series = [{ name: "Solved", data: [easy, medium, hard] }];

  return (
    <div>
      <div className="mb-2 flex gap-4 text-sm">
        <span className="text-green-500 font-medium">Easy: {easy}</span>
        <span className="text-yellow-500 font-medium">Medium: {medium}</span>
        <span className="text-red-500 font-medium">Hard: {hard}</span>
        <span className="text-muted-foreground font-medium">Total: {total}</span>
      </div>
      <Chart options={options} series={series} type="bar" height={260} />
    </div>
  );
}

// ── Codeforces line chart ─────────────────────────────────────────────────────
function CodeforcesLineChart({ data, loading, error, onRetry, darkmode, range, onRangeChange }) {
  if (loading) return <ChartSkeleton />;
  if (error) return <ChartError message={error} onRetry={onRetry} />;
  if (!data || !data.history?.length) return (
    <p className="text-muted-foreground text-sm py-8 text-center">No rating history found.</p>
  );

  const ranges = ["3m", "6m", "1y", "all"];

  const categories = data.history.map((h) =>
    new Date(h.timestamp * 1000).toLocaleDateString("en-US", {
      month: "short", year: "2-digit",
    })
  );
  const ratings = data.history.map((h) => h.rating);
  const changes = data.history.map((h) => h.rating_change ?? 0);

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      foreColor: darkmode ? "#e5e7eb" : "#374151",
    },
    theme: { mode: darkmode ? "dark" : "light" },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#60a5fa"],
    markers: { size: 3 },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      tickAmount: 8,
      labels: { rotate: -30, style: { fontSize: "10px" } },
    },
    yaxis: {
      title: { text: "Rating" },
      labels: { formatter: (v) => Math.round(v) },
    },
    tooltip: {
      custom: ({ dataPointIndex }) => {
        const h = data.history[dataPointIndex];
        const change = h.rating_change ?? 0;
        const color = change >= 0 ? "#4ade80" : "#f87171";
        return `
          <div style="padding:8px;font-size:12px;background:#1f2937;color:#f9fafb;border-radius:6px">
            <div style="font-weight:600">${h.contest ?? ""}</div>
            <div>Rating: <b>${h.rating}</b></div>
            <div>Change: <b style="color:${color}">${change >= 0 ? "+" : ""}${change}</b></div>
            <div style="color:#9ca3af">${h.date}</div>
          </div>`;
      },
    },
    annotations: {
      yaxis: [{
        y: data.max_rating,
        borderColor: "#f59e0b",
        label: {
          text: `Peak: ${data.max_rating}`,
          style: { color: "#fff", background: "#f59e0b", fontSize: "11px" },
        },
      }],
    },
    grid: { borderColor: darkmode ? "#374151" : "#e5e7eb" },
  };

  const series = [{ name: data.username, data: ratings }];

  return (
    <div>
      {/* range selector */}
      <div className="mb-3 flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Range:</span>
        {ranges.map((r) => (
          <Button
            key={r}
            variant={range === r ? "default" : "outline"}
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => onRangeChange(r)}
          >
            {r === "all" ? "All time" : r}
          </Button>
        ))}
        {data.source === "live" && (
          <span className="ml-auto text-xs text-green-500">● Live</span>
        )}
        {data.source === "stored" && (
          <span className="ml-auto text-xs text-yellow-500">● Stored</span>
        )}
      </div>
      <div className="mb-2 flex gap-4 text-sm">
        <span className="text-blue-400 font-medium">Current: {data.current_rating}</span>
        <span className="text-yellow-400 font-medium">Peak: {data.max_rating}</span>
      </div>
      <Chart options={options} series={series} type="line" height={260} />
    </div>
  );
}

// ── Unified line chart ────────────────────────────────────────────────────────
function UnifiedLineChart({ data, loading, error, onRetry, darkmode }) {
  if (loading) return <ChartSkeleton />;
  if (error) return <ChartError message={error} onRetry={onRetry} />;
  if (!data || !data.linechart?.length) return (
    <p className="text-muted-foreground text-sm py-8 text-center">
      No data yet — scores will appear after the daily snapshot runs.
    </p>
  );

  const categories = data.linechart.map((d) => d.date);

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      foreColor: darkmode ? "#e5e7eb" : "#374151",
    },
    theme: { mode: darkmode ? "dark" : "light" },
    stroke: { curve: "smooth", width: 2 },
    colors: ["#a78bfa", "#4ade80", "#60a5fa", "#fb923c", "#facc15"],
    markers: { size: 3 },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      tickAmount: 8,
      labels: { rotate: -30, style: { fontSize: "10px" } },
    },
    yaxis: {
      title: { text: "Score (0–1)" },
      labels: { formatter: (v) => v.toFixed(2) },
      min: 0,
      max: 1,
    },
    tooltip: {
      y: { formatter: (v) => v.toFixed(4) },
    },
    legend: { position: "top" },
    grid: { borderColor: darkmode ? "#374151" : "#e5e7eb" },
  };

  const series = [
    { name: "Total", data: data.linechart.map((d) => d.total_score) },
    { name: "GitHub", data: data.linechart.map((d) => d.github_score) },
    { name: "Codeforces", data: data.linechart.map((d) => d.cf_score) },
    { name: "CodeChef", data: data.linechart.map((d) => d.cc_score) },
    { name: "LeetCode", data: data.linechart.map((d) => d.lt_score) },
  ];

  return <Chart options={options} series={series} type="line" height={280} />;
}

// ── LeetCode tab ──────────────────────────────────────────────────────────────
function LeetCodeTab({ darkmode }) {
  const [heatmapData, setHeatmapData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  const [lineLoading, setLineLoading] = useState(true);
  const [heatmapError, setHeatmapError] = useState(null);
  const [lineError, setLineError] = useState(null);

  const loadHeatmap = useCallback(async () => {
    setHeatmapLoading(true);
    setHeatmapError(null);
    try {
      const data = await fetchTrend("/trends/leetcode/heatmap/");
      setHeatmapData(data);
    } catch (e) {
      setHeatmapError("Failed to load LeetCode heatmap.");
    } finally {
      setHeatmapLoading(false);
    }
  }, []);

  const loadLine = useCallback(async () => {
    setLineLoading(true);
    setLineError(null);
    try {
      const data = await fetchTrend("/trends/leetcode/linechart/");
      setLineData(data);
    } catch (e) {
      setLineError("Failed to load LeetCode chart.");
    } finally {
      setLineLoading(false);
    }
  }, []);

  useEffect(() => { loadHeatmap(); loadLine(); }, []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Daily Submission Activity</CardTitle>
          <CardDescription>Problems submitted per day — last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyHeatmap
            data={heatmapData}
            type="leetcode"
            loading={heatmapLoading}
            error={heatmapError}
            onRetry={loadHeatmap}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Problems Solved by Difficulty</CardTitle>
          <CardDescription>Easy / Medium / Hard breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <LeetCodeLineChart
            data={lineData}
            loading={lineLoading}
            error={lineError}
            onRetry={loadLine}
            darkmode={darkmode}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// ── Codeforces tab ────────────────────────────────────────────────────────────
function CodeforcesTab({ darkmode }) {
  const [heatmapData, setHeatmapData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  const [lineLoading, setLineLoading] = useState(true);
  const [heatmapError, setHeatmapError] = useState(null);
  const [lineError, setLineError] = useState(null);
  const [range, setRange] = useState("all");

  const loadHeatmap = useCallback(async () => {
    setHeatmapLoading(true);
    setHeatmapError(null);
    try {
      const data = await fetchTrend("/trends/codeforces/heatmap/");
      setHeatmapData(data);
    } catch (e) {
      setHeatmapError("Failed to load Codeforces heatmap.");
    } finally {
      setHeatmapLoading(false);
    }
  }, []);

  const loadLine = useCallback(async (r = range) => {
    setLineLoading(true);
    setLineError(null);
    try {
      const data = await fetchTrend(`/trends/codeforces/linechart/?range=${r}`);
      setLineData(data);
    } catch (e) {
      setLineError("Failed to load Codeforces rating history.");
    } finally {
      setLineLoading(false);
    }
  }, []);

  const handleRangeChange = (r) => {
    setRange(r);
    loadLine(r);
  };

  useEffect(() => { loadHeatmap(); loadLine("all"); }, []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Contest Activity</CardTitle>
          <CardDescription>Rating change per contest day — last 12 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyHeatmap
            data={heatmapData}
            type="codeforces"
            loading={heatmapLoading}
            error={heatmapError}
            onRetry={loadHeatmap}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Rating History</CardTitle>
          <CardDescription>Contest rating changes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <CodeforcesLineChart
            data={lineData}
            loading={lineLoading}
            error={lineError}
            onRetry={() => loadLine(range)}
            darkmode={darkmode}
            range={range}
            onRangeChange={handleRangeChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// ── Unified tab ───────────────────────────────────────────────────────────────
function UnifiedTab({ darkmode }) {
  const [heatmapData, setHeatmapData] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  const [lineLoading, setLineLoading] = useState(true);
  const [heatmapError, setHeatmapError] = useState(null);
  const [lineError, setLineError] = useState(null);

  const loadHeatmap = useCallback(async () => {
    setHeatmapLoading(true);
    setHeatmapError(null);
    try {
      const data = await fetchTrend("/trends/unified/heatmap/");
      setHeatmapData(data);
    } catch (e) {
      setHeatmapError("Failed to load unified heatmap.");
    } finally {
      setHeatmapLoading(false);
    }
  }, []);

  const loadLine = useCallback(async () => {
    setLineLoading(true);
    setLineError(null);
    try {
      const data = await fetchTrend("/trends/unified/linechart/");
      setLineData(data);
    } catch (e) {
      setLineError("Failed to load unified score chart.");
    } finally {
      setLineLoading(false);
    }
  }, []);

  useEffect(() => { loadHeatmap(); loadLine(); }, []);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Unified Score Change</CardTitle>
          <CardDescription>Daily score delta — last 12 weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyHeatmap
            data={heatmapData}
            type="unified"
            loading={heatmapLoading}
            error={heatmapError}
            onRetry={loadHeatmap}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Platform Score Comparison</CardTitle>
          <CardDescription>GitHub · Codeforces · CodeChef · LeetCode over time</CardDescription>
        </CardHeader>
        <CardContent>
          <UnifiedLineChart
            data={lineData}
            loading={lineLoading}
            error={lineError}
            onRetry={loadLine}
            darkmode={darkmode}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// ── main exported component ───────────────────────────────────────────────────
export function TrendAnalysis() {
  const { open, isMobile } = useSidebar();
  const { theme } = useTheme();
  const darkmode = theme === "dark";

  const tabs = [
    { value: "unified",    label: "Unified",    icon: BarChart2,   comp: UnifiedTab    },
    { value: "codeforces", label: "Codeforces", icon: Activity,    comp: CodeforcesTab },
    { value: "leetcode",   label: "LeetCode",   icon: TrendingUp,  comp: LeetCodeTab   },
  ];

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
        <h2 className="text-xl font-bold">Trend Analysis</h2>
        <p className="text-sm text-muted-foreground">
          Your personal performance trends across LeetCode, Codeforces and Unified score.
        </p>
      </div>

      {/* tabs — same style as HomePage Overview/Analytics/Leaderboards/Friends */}
      <Tabs defaultValue="unified" className="h-full w-full">
        <TabsList className="w-full">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-1.5"
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-4">
            <tab.comp darkmode={darkmode} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}