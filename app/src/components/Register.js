import { React, useContext } from 'react';
import AuthContext from '../Context/AuthContext.js';
import SignUp from './SignUp.js';
const Register = ({ darkmode }) => {
  let { registerUser } = useContext(AuthContext);
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: darkmode ? 'black' : '',
        width: '100vw',
        height: '93vh',
      }}
    >
      <div style={{ width: '100vw', filter: darkmode ? 'invert(100)' : '' }}>
        <SignUp registerUser={registerUser} />
      </div>
    </div>
  );
};
export default Register;
