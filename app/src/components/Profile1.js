import React, { useContext } from "react";
import AuthContext from "../utils/AuthContext.js";
import Profile from "./Profile.js";
import styles from "../styles/Profile1.module.css";

const Profile1 = ({ darkmode }) => {
  let { update_addUsernames } = useContext(AuthContext);
  return (
    <div className={`${styles.container} ${darkmode && styles.darkmode}`}>
      <div className={`${styles.content} ${darkmode && styles.darkmode}`}>
        <Profile
          darkmode={darkmode}
          update_addUsernames={update_addUsernames}
        />
      </div>
    </div>
  );
};

export default Profile1;