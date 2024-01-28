import React, { useContext } from "react";
import AuthContext from "../utils/AuthContext.js";
import SignUp from "./SignUp.js";
import styles from "../styles/Register.module.css";

const Register = ({ darkmode }) => {
  let { registerUser } = useContext(AuthContext);
  return (
    <div className={`${styles.container} ${darkmode && styles.darkmode}`}>
      <div className={`${styles.content} ${darkmode && styles.darkmode}`}>
        <SignUp registerUser={registerUser} />
      </div>
    </div>
  );
};

export default Register;
