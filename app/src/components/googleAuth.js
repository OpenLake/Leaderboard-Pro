import React,{useState,useEffect} from 'react'
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleAuth = () => {
    const [user,setUser] = useState([]);
    const [profile,setProfile] = useState([]);
    const login=useGoogleLogin({
        onSuccess: (codeResponse)=> setUser(codeResponse),
        onError: (error)=>console.log('Login Failed:', error)
      })
    
      const logOut=()=>{
        googleLogout();
        setProfile(null);
        console.log("log out success");
      }
    
    
      useEffect(()=>{
        
        if(user){
            axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,{
                headers: {
                    Authorization: `Bearer ${user.access_token}`,
                    Accept: 'application/json'
                }
            })
            .then((res)=>{
                setProfile(res.data)
            })
            .catch((err)=>console.log(err));
        }
      },[user])
      return (
          <div className='google-wrap' style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            width: '100vw',
            justifyContent: 'center',
          }}>
            {profile ? (
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google 🚀 </button>
            )}
        </div>
      );
}

export default GoogleAuth