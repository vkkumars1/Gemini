import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <SignIn />
    </div>
  );
};

export default Login;
