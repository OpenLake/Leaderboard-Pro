import {React,useContext} from 'react'
import AuthContext from '../Context/AuthContext.js';
import Profile from './Profile.js'

const Profile1 = ({darkmode}) => {
  return (
    <div style={{position:"absolute",backgroundColor:darkmode?"black":"", width:"100vw",height:"93vh"}}>
      <div style={{width:"100vw",filter:darkmode?"invert(100)":""}}>
        <Profile/>
      </div>
    </div>
  )
}

export default Profile1
