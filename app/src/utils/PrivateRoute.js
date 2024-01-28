import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../utils/AuthContext";

const PrivateRoute = ({ children }) => {
  let { user } = useContext(AuthContext);
  const isAuthenticated = !user ? false : true;

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default PrivateRoute;
