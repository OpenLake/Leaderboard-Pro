import { createContext, useState, useContext, useEffect } from "react"; // add useEffect
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase.config";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};
const googleProvider = new GoogleAuthProvider();
const BACKEND = import.meta.env.VITE_BACKEND;

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null,
  );
  let [user, setUser] = useState(
    authTokens ? jwtDecode(authTokens.access) : null,
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false); // add
  let [userNames, setUserNames] = useState(
    localStorage.getItem("userNames")
      ? JSON.parse(localStorage.getItem("userNames"))
      : null,
  );
  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  let getUsernamesData = async (authToken) => {
    let usernames_response = await fetch(BACKEND + "/userDetails/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authToken.access,
      },
    });
    let usernames_data = await usernames_response.json();
    if (usernames_response.status === 200) {
      localStorage.setItem("userNames", JSON.stringify(usernames_data));
    } else {
      console.log("ERROR!!!");
    }
    return usernames_data;
  };
  let loginUser = async (form_data) => {
    let response = await fetch(BACKEND + "/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form_data.username,
        password: form_data.password,
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      let usernames_data = await getUsernamesData(data);
      setUserNames(usernames_data);
      navigate("/");
    } else {
      alert("ERROR!!!!");
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    setUserNames(null);
    localStorage.removeItem("userNames");
    navigate("/login");
    if (auth.currentUser) return signOut(auth);
  };
  let registerUser = async (form_data) => {
    let response = await fetch(BACKEND + "/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: form_data.first_name,
        email: form_data.email,
        username: form_data.username,
        password: form_data.password,
        last_name: form_data.last_name,
        cc_uname: form_data.cc_uname,
        cf_uname: form_data.cf_uname,
        gh_uname: form_data.gh_uname,
        lt_uname: form_data.lt_uname,
      }),
    });
    if (response.status === 200) {
      let response = await fetch(BACKEND + "/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: form_data.username,
          password: form_data.password,
        }),
      });
      let data = await response.json();
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");
        let usernames_data = await getUsernamesData(data);
        setUserNames(usernames_data);
      } else {
        alert("ERROR!!!!");
      }
    } else {
      alert("ERROR!!!!");
    }
  };
  let update_addUsernames = async (form_data) => {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!");
    let response = await fetch(BACKEND + "/api/insertapi/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + authTokens.access,
      },
      body: JSON.stringify({
        cc_uname: form_data.codechef,
        cf_uname: form_data.codeforces,
        gh_uname: form_data.github,
        lt_uname: form_data.leetcode,
      }),
    });
    if (response.status === 201) {
      let usernames_data = await getUsernamesData(authTokens);
      setUserNames(usernames_data);
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
  const SignInWithGoogle = async () => {
    let response;
    try {
      response = await signInWithPopup(auth, googleProvider);
      if (response && !(response["status"] === 400)) {
        let logresponse = await fetch(BACKEND + "/api/token/google/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: response.user.accessToken,
          }),
        });
        let data = await logresponse.json();
        if (logresponse.status === 200) {
          let token = data.token;
          setAuthTokens(token);
          setUser(jwtDecode(token.access));
          localStorage.setItem("authTokens", JSON.stringify(token));
          let usernames_data = await getUsernamesData(token);
          setUserNames(usernames_data);
        } else {
          alert(data.message);
        }
      } else {
        console.log("Please try logging in again");
      }
    } catch (error) {
      console.log(error);
      console.log("Please try logging in again");
    }
    return response;
  };
  const SignUpWithGoogle = async () => {
    let response;
    try {
      response = await signInWithPopup(auth, googleProvider);
      if (response && !(response["status"] === 400)) {
        let regresponse = await fetch(BACKEND + "/api/register/google/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: response.user.accessToken,
            username: response.user.email.split("@")[0],
          }),
        });
        let data = await regresponse.json();
        if (regresponse.status === 200) {
          let token = data.token;
          setAuthTokens(token);
          setUser(jwtDecode(token.access));
          localStorage.setItem("authTokens", JSON.stringify(token));
        } else {
          alert("Please Try registering again");
        }
        console.log(response);
      } else {
        alert("Please Try registering again");
      }
    } catch (error) {
      console.log(error);
      alert("Please Try registering again");
    }
    return response;
  };
  let contextData = {
    user: user,
    authTokens: authTokens,
    isAuthenticated, 
    loginUser: loginUser,
    registerUser: registerUser,
    logoutUser: logoutUser,
    toLogin: toLogin,
    toRegister: toRegister,
    update_addUsernames: update_addUsernames,
    SignInWithGoogle,
    SignUpWithGoogle,
    loading,
    userNames: userNames,
  };
  
  // useEffect(() => {

  //     const token = async (username) => {
  //     let response = await fetch(BACKEND + "/api/token/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         username: username,
  //         password: "GOOGLEDATA",
  //       }),
  //     });
  //     let data = await response.json();
  //     if (response.status === 200) {
  //       setAuthTokens(data);
  //       setUser(jwtDecode(data.access));
  //       localStorage.setItem("authTokens", JSON.stringify(data));
  //       navigate("/");
  //     } else {
  //       alert("ERROR!!!!");
  //     }
  //   };

  //     const unsubscribe = auth.onAuthStateChanged((user) => {
  //       setUser(user);
  //       setLoading(false);
  //       let isNewUser = false;
  //       if (user) {
  //         const { email, displayName, photoURL } = user;

  //         const userData = {
  //           email,
  //           username: displayName,
  //           photoURL
  //         };
  //         console.log(userData);
  //       isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
  //       }

  //       if (isNewUser) {
  //         console.log("New User");
  //         async function register() {
  //           let response = await fetch(BACKEND + "/api/register/", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               first_name: user.displayName,
  //               email: user.email,
  //               username: user.displayName,
  //               //   password: e.target.form.password.value,
  //               //   last_name: e.target.form.last_name.value,
  //               cc_uname:"",
  //               cf_uname: "",
  //               gh_uname: "",
  //               lt_uname: "",
  //             }),
  //           });
  //           if (response.status === 200) {
  //             token(user.displayName);
  //           } else {
  //             alert("ERROR!!!!", response);
  //           }
  //         }
  //         register();
  //       } else {
  //         if(user && user.displayName){
  //         token(user.displayName);
  //         }
  //         console.log("Old User");
  //       }
  //     });

  //     return () => unsubscribe();
  //   }, [navigate]);
  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
