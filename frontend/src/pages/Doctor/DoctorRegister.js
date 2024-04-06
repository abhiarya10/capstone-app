import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DoctorRegister.css";

function DoctorRegister() {
  const [registerData, setRegisterData] = useState({
    fname: "",
    lname: "",
    email: "",
    specialization: "",
    password: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState("");

  function registerHandler() {}
  function registerInputHandler() {}
  return (
    <div className="register-main-body">
      <div className="register-container">
        <p className="msg-text">{msg}</p>

        <div className="register-sec-div">
          <p className="create-acc-text">Create An Account</p>
          <form className="form-div" onClick={registerHandler}>
            <div className="first-last-name-div">
              <div className="label-input-div">
                <label>First Name</label>
                <input
                  placeholder="Your first name"
                  value={registerData.fname}
                  name="fname"
                  type="text"
                  onChange={registerInputHandler}
                />
              </div>
              <div className="label-input-div">
                <label>Last Name</label>
                <input
                  placeholder="Your last name"
                  value={registerData.lname}
                  name="lname"
                  type="text"
                  onChange={registerInputHandler}
                />
              </div>
            </div>
            <div className="first-last-name-div">
              <div className="label-input-div">
                <label>Email</label>
                <input
                  placeholder="Your email"
                  value={registerData.email}
                  name="email"
                  type="email"
                  onChange={registerInputHandler}
                />
              </div>
              <div className="label-input-div">
                <label>Specialization</label>
                <input
                  placeholder="Enter specialization"
                  value={registerData.specialization}
                  type="text"
                  onChange={registerInputHandler}
                />
              </div>
            </div>
            <div className="first-last-name-div">
              <div className="label-input-div">
                <label>Password</label>
                <input
                  placeholder="Set password"
                  value={registerData.password}
                  name="password"
                  type="password"
                  onChange={registerInputHandler}
                />
              </div>
              <div className="label-input-div">
                <label>Confirm Password</label>
                <input
                  placeholder="Confirm password"
                  value={registerData.confirmPassword}
                  name="confirmPassword"
                  type="password"
                  onChange={registerInputHandler}
                />
              </div>
            </div>
            <div className="btn-div-createAcc">
              <button type="submit" className="reg-btn">
                Create Account
              </button>
            </div>
          </form>
          <div className="acc-login-div">
            <p>Already have an Account?</p>
            <Link to="/doctorLogin" className="login-link">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorRegister;
