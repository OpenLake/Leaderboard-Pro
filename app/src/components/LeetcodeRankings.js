import React, { useState } from 'react';
import axios from 'axios';

const LeetcodeRankings = ({ darkmode }) => {
  const [contestId, setContestId] = useState('');
  const [usernames, setUsernames] = useState([]);
  const [rankings, setRankings] = useState([]);

  const handleContestIdChange = (event) => {
    setContestId(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsernames(event.target.value.split(','));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .get('/api/contest-rankings/', {
        params: {
          contest: contestId,
          usernames: usernames,
        },
      })
      .then((response) => {
        const task_id = response.data.task_id;
        checkTaskStatus(task_id);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const checkTaskStatus = (task_id) => {
    axios
      .get(`/api/task-status/${task_id}/`)
      .then((response) => {
        if (response.data.status === 'SUCCESS') {
          setRankings(response.data.result);
        } else {
          setTimeout(() => {
            checkTaskStatus(task_id);
          }, 1000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginTop:'100px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Contest ID:
          <input
            type="text"
            value={contestId}
            onChange={handleContestIdChange}
            style={{ marginLeft: '10px' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Usernames (comma-separated):
          <input
            type="text"
            value={usernames}
            onChange={handleUsernameChange}
            style={{ marginLeft: '10px' }}
          />
        </label>
        <button type="submit" style={{ marginLeft: '10px', marginTop: '10px' }}>
          Get Rankings
        </button>
      </form>

      <h2>Rankings:</h2>
      {rankings.length > 0 ? (
        <ul>
          {rankings.map((rank) => (
            <li
              key={rank.username}
              style={{
                marginBottom: '5px',
                backgroundColor: darkmode ? 'black' : 'white',
                color: darkmode ? 'white' : 'black',
              }}
            >
              Username: {rank.username}, Rank: {rank.rank || 'N/A'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No rankings available</p>
      )}
    </div>
  );
};

export default LeetcodeRankings;
