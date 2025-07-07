import { useState } from "react";
import Profile from "./Profile.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import Goals from "./Goals.jsx";

const Profile1 = ({ darkmode, leetcodeUsers, codeforcesUsers }) => {
  let { update_addUsernames } = useAuth();
  const [update, setUpdate] = useState(false);
  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: darkmode ? "black" : "",
        width: "100vw",
        height: "92vh",
        top: "8vh",
        zIndex: "1",
      }}
    >
      <button
        onClick={() => setUpdate(!update)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: !darkmode ? "#39ace7" : "#2F4562",
          color: darkmode ? "white" : "black",
          zIndex: "1000",
        }}
      >
        Update usernames
      </button>
      {update && (
        <div
          style={{ width: "100vw", filter: darkmode ? "invert(100)" : "" }}
        >
          <Profile
            darkmode={darkmode}
            update_addUsernames={update_addUsernames}
          />
        </div>
      )}
      {!update && (
        <div
          style={{ width: "100vw", filter: darkmode ? "invert(100)" : "" }}
        >
          <Goals
            darkmode={""}
            leetcodeUsers={leetcodeUsers}
            codeforcesUsers={codeforcesUsers}
          />
        </div>
      )}
    </div>
  );
};

export default Profile1;
