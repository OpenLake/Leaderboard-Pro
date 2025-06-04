import SignUp from "./SignUp.js";
import { useAuth } from "../Context/AuthContext.js";
const Register = ({ darkmode }) => {
  let { SignInWithGoogle, registerUser } = useAuth();
  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: darkmode ? "black" : "",
        width: "100vw",
        height: "93vh",
      }}
    >
      <div style={{ width: "100vw", filter: darkmode ? "invert(100)" : "" }}>
        <SignUp registerUser={registerUser} googleAuth={SignInWithGoogle} />
      </div>
    </div>
  );
};
export default Register;
