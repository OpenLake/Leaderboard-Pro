import SignUp from "./SignUp.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import { useSidebar } from "./ui/sidebar";
const Register = ({ darkmode }) => {
  let { SignUpWithGoogle, registerUser } = useAuth();
  const { open } = useSidebar();
  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: darkmode ? "black" : "",
        width: open ? "calc(100vw - var(--sidebar-width))" : "100vw",
        height: "93vh",
      }}
    >
      <div
        style={{ width: "100vw", filter: darkmode ? "invert(100)" : "" }}
      >
        <SignUp
          registerUser={registerUser}
          googleAuth={SignUpWithGoogle}
        />
      </div>
    </div>
  );
};
export default Register;
