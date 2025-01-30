import { createContext, useState } from 'react';
import jwt_decode from 'jwt-decode';
import { useHistory } from 'react-router-dom';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(
    localStorage.getItem('authTokens')
      ? JSON.parse(localStorage.getItem('authTokens'))
      : null
  );
  let [user, setUser] = useState(
    authTokens ? jwt_decode(authTokens.access) : null
  );
  const history = useHistory();
  let loginUser = async (e) => {
    e.preventDefault();
    let response = await fetch('http://localhost:8000/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: e.target.UserName.value,
        password: e.target.password.value,
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
      history.push('/');
    } else {
      alert('ERROR!!!!');
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    history.push('/login');
  };
  let registerUser = async (e) => {
    e.preventDefault();
    let response = await fetch('http://localhost:8000/api/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    });
    if (response.status === 200) {
      let response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      });
      let data = await response.json();
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
        history.push('/');
      } else {
        alert('ERROR!!!!');
      }
    } else {
      alert('ERROR!!!!');
    }
  };
  let update_addUsernames = async (e) => {
    e.preventDefault();
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!');
    // console.log(JSON.parse(localStorage.getItem('authTokens')).access);https://leaderboard-stswe61wi-aditya062003.vercel.app
    let response = await fetch('http://localhost:8000/api/insertapi/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + JSON.parse(localStorage.getItem('authTokens')).access,
      },
      body: JSON.stringify({
        cc_uname: e.target.cc_uname.value,
        cf_uname: e.target.cf_uname.value,
        gh_uname: e.target.gh_uname.value,
        lt_uname: e.target.lt_uname.value,
      }),
    });
    if (response.status === 201) {
      history.push('/');
    } else {
      alert('ERROR!!!!');
    }
  };
  let toLogin = () => {
    history.push('/login');
  };
  let toRegister = () => {
    history.push('/register');
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
