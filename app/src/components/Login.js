import { React, useContext } from 'react';
import AuthContext from '../Context/AuthContext.js';
import SignIn from './SignIn.js';

const Login = ({ darkmode }) => {
  let { loginUser } = useContext(AuthContext);
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: darkmode ? 'black' : '',
        width: '100vw',
        height: '93vh',
        marginTop: '4rem',
      }}
    >
      <div style={{ width: '100vw', filter: darkmode ? 'invert(100)' : '' }}>
        <SignIn loginUser={loginUser} />
      </div>
    </div>
  );
};
export default Login;
