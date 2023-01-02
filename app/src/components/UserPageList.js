import React,{useState,useEffect,useContext} from 'react'
import AuthContext from '../Context/AuthContext';

export const UserPageList = () => {
    let [usernames,setUsernames]=useState([]);
    let {authTokens}=useContext(AuthContext)
    useEffect(()=>{
        // console.log(authTokens.access); 
        getUsernames();
    },[])
    let getUsernames=async ()=>{
        let response=await fetch("http://localhost:8000/api/usernames/",{
            method:"GET",
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer '+ String(authTokens.access)
            }
        })
        let data=await response.json()
        setUsernames(data)
    }
  return (
    <div>
      <ul>
        {usernames.map(username=>(
            <li key={username.id}>{username.cc_uname}</li>
        ))}
      </ul>
    </div>
  )
}
