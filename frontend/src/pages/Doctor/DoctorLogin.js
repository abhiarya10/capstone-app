import React, { useState } from "react";
import "./DoctorLogin.css";
import { Link } from "react-router-dom";

function DoctorLogin() {
  const [msg, setMsg] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  function loginInputHandler() {}
  function loginSubmitHandler() {}

  return (
    <div className="login-main-body">
      <div className="login-container">
        <p className="login-header">Login To Your Account</p>
        <form onSubmit={loginSubmitHandler}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={loginData.email}
            onChange={loginInputHandler}
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={loginData.password}
            onChange={loginInputHandler}
          />
          <label className="forgot-pass">Forgot password?</label>
          <button type="submit">Login</button>
        </form>
        <div className="new-user-register-div">
          <p className="new-user">New User? </p>
          <Link to="/doctorRegister" className="reg-link">
            Register here
          </Link>
        </div>
      </div>
      {msg && <p className="msg-text">{msg}</p>}
    </div>
  );
}

export default DoctorLogin;
