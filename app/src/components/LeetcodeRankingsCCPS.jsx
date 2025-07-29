import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSidebar } from "@/components/ui/sidebar";
import { DataTable } from "./ui/data-table";
import { Button } from "@/components/ui/button";
import { ComboBox } from "./ui/combobox";

const LeetcodeRankingsCCPS = () => {
  const [contestId, setContestId] = useState("");
  const [rankings, setRankings] = useState([]);
  const { open, isMobile } = useSidebar();
  const columns = [
    {
      accessorKey: "rank",
      header: "Insitute Rank",
      cell: ({ row }) =>
        row.getValue("ranking") !== 0 ? row.getValue("rank") : "N/A",
    },
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => {
        const username = row.getValue("username");
        return (
          <Button variant="link" asChild>
            <Link
              style={{ textDecoration: "none" }}
              to={`/leetcoderanking/${username}`}
            >
              {username}
            </Link>
          </Button>
        );
      },
    },
    {
      accessorKey: "ranking",
      header: "Ranking",
    },
  ];

  const handleContestIdChange = (value) => {
    const selectedContest = value;
    const convertedContestId = selectedContest
      .replace(/\s/g, "")
      .replace("Contest", "")
      .toLowerCase();

    setContestId(convertedContestId);
  };
  const [contestOptions, setcontestoptions] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND + "/contest-rankings/",
        );
        const data = response.data;

        const contestRankings = data.map((rank, index) => ({
          username: rank.usernames,
          ranking: rank[contestId],
          rank: index + 1,
        }));

        const columnNames = Object.keys(data[0]);
        columnNames.shift();
        // seems like it was a 1D array, so i changed it to make sure it conforms to the
        // {value, label} pair of the combobox until i can figure out what's happening
        setcontestoptions(
          columnNames.map((option) => ({
            value: option,
            label: option,
          })),
        );

        // Sort the rankings based on the contest ranking and whether the ranking is zero or not
        const sortedRankings = contestRankings.sort((a, b) => {
          if (a.ranking === 0 && b.ranking === 0) {
            return 0;
          } else if (a.ranking === 0) {
            return 1;
          } else if (b.ranking === 0) {
            return -1;
          } else {
            return a.ranking - b.ranking;
          }
        });

        setRankings(sortedRankings);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRankings();
  }, [contestId]);

  return (
    <div
      className="h-full space-y-2 px-1.5 py-1"
      style={{
        width:
          open && !isMobile
            ? "calc(100vw - var(--sidebar-width))"
            : "100vw",
      }}
    >
      <ComboBox
        visibleText="Select a contest"
        emptyText="No such contest."
        info={contestOptions}
        onValueChange={handleContestIdChange}
      />
      <DataTable data={rankings} columns={columns} />
    </div>
  );
};

export default LeetcodeRankingsCCPS;
