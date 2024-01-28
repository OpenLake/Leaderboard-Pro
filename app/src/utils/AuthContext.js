import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(
    authTokens ? jwtDecode(authTokens.access) : null
  );
  const navigate = useNavigate();
  let loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "api/token/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: e.target.UserName.value,
          password: e.target.password.value,
        }),
      }
    );
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
    } else {
      alert("ERROR!!!!");
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };
  let registerUser = async (e) => {
    e.preventDefault();
    let response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "api/register/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: e.target.first_name.value,
          email: e.target.email.value,
          username: e.target.username.value,
          password: e.target.password.value,
          last_name: e.target.last_name.value,
          cc_uname: e.target.cc_uname.value,
          cf_uname: e.target.cf_uname.value,
          gh_uname: e.target.gh_uname.value,
          lt_uname: e.target.lt_uname.value,
        }),
      }
    );
    if (response.status === 200) {
      let response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "api/token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: e.target.username.value,
            password: e.target.password.value,
          }),
        }
      );
      let data = await response.json();
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");
      } else {
        alert("ERROR!!!!");
      }
    } else {
      alert("ERROR!!!!");
    }
  };
  let update_addUsernames = async (e) => {
    e.preventDefault();
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!");
    // console.log(JSON.parse(localStorage.getItem('authTokens')).access);https://leaderboard-stswe61wi-aditya062003.vercel.app
    let response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "api/insertapi/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authTokens")).access,
        },
        body: JSON.stringify({
          cc_uname: e.target.cc_uname.value,
          cf_uname: e.target.cf_uname.value,
          gh_uname: e.target.gh_uname.value,
          lt_uname: e.target.lt_uname.value,
        }),
      }
    );
    if (response.status === 201) {
      navigate("/");
    } else {
      alert("ERROR!!!!");
    }
  };
  let toLogin = () => {
    navigate("/login");
  };
  let toRegister = () => {
    navigate("/register");
  };
  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    registerUser: registerUser,
    logoutUser: logoutUser,
    toLogin: toLogin,
    toRegister: toRegister,
    update_addUsernames: update_addUsernames,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
