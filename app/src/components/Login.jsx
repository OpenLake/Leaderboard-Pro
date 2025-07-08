import SignIn from "./SignIn.jsx";
import { useAuth } from "../Context/AuthContext.jsx";

const Login = ({ darkmode }) => {
  let { SignInWithGoogle, loginUser } = useAuth();
  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: darkmode ? "black" : "",
        width: "100vw",
        height: "93vh",
        marginTop: "4rem",
      }}
    >
      <div
        style={{ width: "100vw", filter: darkmode ? "invert(100)" : "" }}
      >
        <SignIn loginUser={loginUser} googleAuth={SignInWithGoogle} />
      </div>
    </div>
  );
};
export default Login;
