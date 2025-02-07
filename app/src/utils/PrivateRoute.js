import React from 'react';
import {Navigate} from 'react-router-dom'
import { useAuth } from '../firebase/AuthContext'
const PrivateRoute=({children})=>{
    const {user, loading} = useAuth();
    if(loading){
        return <h1>Loading...</h1>
    }
    if(user){
        return children;
    }
    return <Navigate to="/login" replace/>
}
export default PrivateRoute