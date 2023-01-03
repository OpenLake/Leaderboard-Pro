import React from 'react'
import SignUp from './SignUp.js'
const Register = ({darkmode}) => {

  // console.log("REsgiter me aaya to sahi");
  return (
    <div style={{position:"absolute",backgroundColor:darkmode?"black":"", width:"100vw",height:"93vh"}}>
      <div style={{width:"100vw",filter:darkmode?"invert(100)":""}}>
      <SignUp/>
      </div>
    </div>
  )
}
export default Register
