import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Chart from 'react-apexcharts';

const LeetcodeGraphs = ({ darkmode }) => {
  const { username } = useParams();
  const [rankings, setRankings] = useState([]);
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);
  const [contestID, setContestID] = useState([]);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/contest-rankings/'
        );
        const data = response.data;

        const contestRankings = data
          .filter((rank) => rank.usernames === username)
          .map((rank) => {
            const variableNames = Object.keys(rank).filter(
              (key) => key !== 'usernames'
            );
            setContestID(variableNames);
            return {
              username: rank.usernames,
              ranking: variableNames.map((key) => rank[key]),
            };
          });

        setRankings(contestRankings);
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchRankings();
  }, []);

  useEffect(() => {
    if (rankings.length > 0) {
      const { username, ranking } = rankings[0];
      const reversedRanking = ranking.slice().reverse();
      setSeries([
        {
          name: username,
          data: ranking,
        },
      ]);
      setOptions({
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false,
          },
          ...(darkmode && { background: '#252f3d', foreColor: '#fff' }), // Set background and foreColor for dark mode
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'straight',
        },
        title: {
          text: 'Leetocde Contest Rankings',
          align: 'left',
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: contestID,
        },
        // yaxis: {
        //   reversed: true,
        // },
        tooltip: {
          fillSeriesColor: true,
        },
      });
    }
  }, [rankings, darkmode]);

  return (
    <div style={{ marginTop: '100px' }}>
      {username}
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default LeetcodeGraphs;
