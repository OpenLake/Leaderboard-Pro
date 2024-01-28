import React, { useContext } from "react";
import AuthContext from "../utils/AuthContext.js";
import SignIn from "./SignIn.js";
import styles from "../styles/Login.module.css";

const Login = ({ darkmode }) => {
  let { loginUser } = useContext(AuthContext);
  return (
    <div className={`${styles.container} ${darkmode && styles.darkmode}`}>
      <div className={`${styles.content} ${darkmode && styles.darkmode}`}>
        <SignIn loginUser={loginUser} />
      </div>
    </div>
  );
};

export default Login;