import React from 'react'
import SignIn from './SignIn.js'
const Login = ({darkmode}) => {
  return (
    <div style={{position:"absolute",backgroundColor:darkmode?"black":"", width:"100vw",height:"93vh"}}>
      <div style={{width:"100vw",filter:darkmode?"invert(100)":""}}>
        <SignIn/>
      </div>
    </div>
  )
}

export default Login
