import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase.config";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const googleProvider = new GoogleAuthProvider();

export const AuthProvide = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  const SignInWithGoogle = async () => {
    return await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    setAuthTokens(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
    return signOut(auth);
  };

  const update_addUsernames = async (e) => {
    e.preventDefault();
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!");
    // console.log(JSON.parse(localStorage.getItem('authTokens')).access);https://leaderboard-stswe61wi-aditya062003.vercel.app
    let response = await fetch("http://localhost:8000/api/insertapi/", {
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
    });
    if (response.status === 201) {
      navigate("/");
    } else {
      alert("ERROR!!!!");
    }
  };

  const toLogin = () => {
    navigate("/login");
  };
  const toRegister = () => {
    navigate("/register");
  };

  

  const value = {
    authTokens,
    user,
    loading,
    SignInWithGoogle,
    logout,
    toLogin,
    toRegister,
    update_addUsernames,
  };

  useEffect(() => {

    const token = async (username) => {
    let response = await fetch("http://localhost:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: "GOOGLEDATA",
      }),
    });
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

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      let isNewUser = false;
      if (user) {
        const { email, displayName, photoURL } = user;

        const userData = {
          email,
          username: displayName,
          photoURL
        };
        console.log(userData);
      isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
      }

      if (isNewUser) {
        console.log("New User");
        async function register() {
          let response = await fetch("http://localhost:8000/api/register/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: user.displayName,
              email: user.email,
              username: user.displayName,
              //   password: e.target.password.value,
              //   last_name: e.target.last_name.value,
              cc_uname:"",
              cf_uname: "",
              gh_uname: "",
              lt_uname: "",
            }),
          });
          if (response.status === 200) {
            token(user.displayName);
          } else {
            alert("ERROR!!!!", response);
          }
        }
        register();
      } else {
        if(user && user.displayName){
        token(user.displayName);
        }
        console.log("Old User");
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
