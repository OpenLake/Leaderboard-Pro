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
const parseStoredJSON = (key) => {
  const rawValue = localStorage.getItem(key);
  if (!rawValue) return null;
  try {
    return JSON.parse(rawValue);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

const readJsonSafely = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(
    parseStoredJSON("authTokens"),
  );
  let [user, setUser] = useState(
    authTokens ? jwtDecode(authTokens.access) : null,
  );
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(authTokens?.access);
  let [userNames, setUserNames] = useState(
    parseStoredJSON("userNames"),
  );
  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [authTokens]);


  let getUsernamesData = async (authToken) => {
    if (!authToken?.access) return null;
    try {
      let usernames_response = await fetch(BACKEND + "/userDetails/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken.access,
        },
      });
      let usernames_data = await readJsonSafely(usernames_response);
      if (usernames_response.status === 200 && usernames_data) {
        localStorage.setItem("userNames", JSON.stringify(usernames_data));
        return usernames_data;
      }
      localStorage.removeItem("userNames");
      return null;
    } catch {
      localStorage.removeItem("userNames");
      return null;
    }
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
    let data = await readJsonSafely(response);
    if (response.status === 200 && data?.access) {
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
      let data = await readJsonSafely(response);
      if (response.status === 200 && data?.access) {
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
      if (!auth) {
        alert("Firebase is not configured. Check frontend env values.");
        return false;
      }
      response = await signInWithPopup(auth, googleProvider);
      if (response && !(response["status"] === 400)) {
        const credential = GoogleAuthProvider.credentialFromResult(response);
        const accessToken =
          credential?.accessToken || response?.user?.accessToken;
        if (!accessToken) {
          alert("Google login failed: missing access token.");
          return false;
        }
        let logresponse = await fetch(BACKEND + "/api/token/google/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: accessToken,
          }),
        });
        let data = await readJsonSafely(logresponse);
        if (logresponse.status === 200 && data?.token?.access) {
          let token = data.token;
          setAuthTokens(token);
          setUser(jwtDecode(token.access));
          localStorage.setItem("authTokens", JSON.stringify(token));
          let usernames_data = await getUsernamesData(token);
          setUserNames(usernames_data);
          return true;
        } else {
          alert(data?.message || "Google login failed.");
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      alert("Please try logging in again");
      return false;
    }
  };
  const SignUpWithGoogle = async () => {
    let response;
    try {
      if (!auth) {
        alert("Firebase is not configured. Check frontend env values.");
        return false;
      }
      response = await signInWithPopup(auth, googleProvider);
      if (response && !(response["status"] === 400)) {
        const credential = GoogleAuthProvider.credentialFromResult(response);
        const accessToken =
          credential?.accessToken || response?.user?.accessToken;
        if (!accessToken) {
          alert("Google registration failed: missing access token.");
          return false;
        }
        let regresponse = await fetch(BACKEND + "/api/register/google/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: accessToken,
            username: response.user.email.split("@")[0],
          }),
        });
        let data = await readJsonSafely(regresponse);
        if (regresponse.status === 200 && data?.token?.access) {
          let token = data.token;
          setAuthTokens(token);
          setUser(jwtDecode(token.access));
          localStorage.setItem("authTokens", JSON.stringify(token));
          let usernames_data = await getUsernamesData(token);
          setUserNames(usernames_data);
          return true;
        } else {
          alert("Please Try registering again");
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      alert("Please Try registering again");
      return false;
    }
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
