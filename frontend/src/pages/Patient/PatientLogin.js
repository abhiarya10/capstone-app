import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PatientLogin.css";
import { logInContext } from "../../GlobalState/LoggedInState";

function PatientLogin() {
  const [msg, setMsg] = useState("");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const { setGlobalLogIn } = useContext(logInContext);
  const navigate = useNavigate();

  function loginInputHandler(e) {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  async function loginSubmitHandler(e) {
    e.preventDefault();

    if (!loginData.email) {
      setMsg("Please Enter Email ID");
      return;
    }
    if (!loginData.password) {
      setMsg("Please Enter Password");
      return;
    }

    try {
      const userLoginData = {
        email: loginData.email,
        password: loginData.password,
      };

      const response = await fetch("http://127.0.0.1:5000/patientLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userLoginData),
      });
      if (!response.ok) {
        const data = await response.json();
        console.log("LogIn failed", data.error);
        setMsg(data.error);
      } else {
        const data = await response.json();
        console.log(data);
        setGlobalLogIn(data);
        setLoginData({
          email: "",
          password: "",
        });

        setTimeout(() => {
          setMsg("Redirecting to home page");
        }, 2000);

        setTimeout(() => {
          navigate("/patient");
        }, 4000);
      }
    } catch (error) {
      console.error("LogIn failed", error.message);
      setMsg("Server is closed right now, contact admin");
    }
  }

  return (
    <div className="patient-login-main-body">
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
          <Link to="/patientRegister" className="reg-link">
            Register here
          </Link>
        </div>
      </div>
      {msg && <p className="msg-text">{msg}</p>}
    </div>
  );
}

export default PatientLogin;
