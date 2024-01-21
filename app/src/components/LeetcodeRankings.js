import React, { useState } from 'react';

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url = `http://localhost:8000/api/leetcodecontestrankings/?contest=${contestId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authTokens')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRankings(data);
        console.log(data);
      } else {
        throw new Error('Request failed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginTop: '100px' }}>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          Contest ID:
          <input
            type="text"
            value={contestId}
            onChange={handleContestIdChange}
            style={{ marginLeft: '10px' }}
          />
        </label>
        {/* <label style={{ display: 'block', marginBottom: '10px' }}>
          Usernames (comma-separated):
          <input
            type="text"
            value={usernames}
            onChange={handleUsernameChange}
            style={{ marginLeft: '10px' }}
          />
        </label> */}
        <button type="submit" style={{ marginLeft: '10px', marginTop: '10px' }}>
          Get Rankings
        </button>
      </form>

      <h2>Rankings:</h2>
      {rankings.length > 0 ? (
        <ul>
          {rankings.map((rank, index) => (
            <li
              key={rank.username}
              style={{
                marginBottom: '5px',
                backgroundColor: darkmode ? 'black' : 'white',
                color: darkmode ? 'white' : 'black',
              }}
            >
              Institute-Rank: {index + 1}, Username: {rank.username},
              OverallRank: {rank.ranking}
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
