import { createContext,useState,useEffect } from "react";
import jwt_decode from  "jwt-decode"
import {useHistory} from "react-router-dom"



const AuthContext=createContext()
export default AuthContext;

export const AuthProvider=({children})=>{
    let [authTokens,setAuthTokens]=useState(localStorage.getItem('authTokens')?JSON.parse(localStorage.getItem('authTokens')):null)
    let [user,setUser]=useState(authTokens?jwt_decode(authTokens.access):null)
    const history=useHistory()
    let loginUser=async (e)=>
    {
        e.preventDefault();
        let response=await fetch('http://localhost:8000/api/token/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                'username':e.target.UserName.value,'password':e.target.password.value
            })
        })
        let data = await response.json()
        if(response.status===200)
        {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens',JSON.stringify(data))
            history.push('/')
        }else{
            alert('ERROR!!!!')
        }
    }

    let logoutUser=()=>{
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        history.push('/login')
    }
    let registerUser=async(e)=>
    {
        e.preventDefault();
        let response=await fetch('http://localhost:8000/api/register/',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                'first_name':e.target.first_name.value,'email':e.target.email.value,'username':e.target.username.value,'password':e.target.password.value,
                'last_name':e.target.last_name.value,'cc_uname':e.target.cc_uname.value,'cf_uname':e.target.cf_uname.value,'gh_uname':e.target.gh_uname.value
            })
        })
        let data = await response.json()
        if(response.status===200)
        {
            history.push('/login')
        }else{
            alert('ERROR!!!!')
        }
    }
    let contextData={
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        registerUser:registerUser,
        logoutUser:logoutUser
    }
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}