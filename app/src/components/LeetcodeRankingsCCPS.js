// import React, { useState } from 'react';
// import axios from 'axios';

// const LeetcodeRankingsCCPS = ({ darkmode }) => {
//   const [contestId, setContestId] = useState('');
//   const [usernames, setUsernames] = useState([]);
//   const [rankings, setRankings] = useState([]);

//   const handleContestIdChange = (event) => {
//     setContestId(event.target.value);
//   };

//   const handleUsernameChange = (event) => {
//     setUsernames(event.target.value.split(','));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       const response = await axios.get('http://localhost:8000/contest-rankings/', {
//         params: {
//           contest: contestId,
//         },
//       });
//       const data = response.data;
//       setRankings(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit} style={{ marginTop:'100px' }}>
//         <label style={{ display: 'block', marginBottom: '10px' }}>
//           Contest ID:
//           <input
//             type="text"
//             value={contestId}
//             onChange={handleContestIdChange}
//             style={{ marginLeft: '10px' }}
//           />
//         </label>
//         <button type="submit" style={{ marginLeft: '10px', marginTop: '10px' }}>
//           Get Rankings
//         </button>
//       </form>

//       <h2>Rankings:</h2>
//       {rankings.length > 0 ? (
//         <ul>
//           {rankings.map((rank, index) => (
//             <li
//               key={rank.username}
//               style={{
//                 marginBottom: '5px',
//                 backgroundColor: darkmode ? 'black' : 'white',
//                 color: darkmode ? 'white' : 'black',
//               }}
//             >
//               Institute-Rank: {index + 1}, Username: {rank.username}, OverallRank: {rank.ranking || 'N/A'}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No rankings available</p>
//       )}
//     </div>
//   );
// };
// export default LeetcodeRankingsCCPS;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeetcodeRankingsCCPS = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/contest-with-contestants/')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      {data.map(contest => (
        <div key={contest.id}>
          <h2>{contest.name}</h2>
          <ul>
            {contest.contestant__username.map((username, index) => (
              <li key={index}>
                {username} - Ranking: {contest.contestant__ranking[index]}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default LeetcodeRankingsCCPS;
