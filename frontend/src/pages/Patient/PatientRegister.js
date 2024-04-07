import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PatientRegister.css";

function PatientRegister() {
  const [registerData, setRegisterData] = useState({
    username: "",
    age: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function registerInputHandler(e) {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function registerHandler(e) {
    e.preventDefault();

    const patientRegistrationData = {
      username: registerData.username,
      age: registerData.age,
      gender: registerData.gender,
      email: registerData.email,
      password: registerData.password,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/patientRegistration",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patientRegistrationData),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        const data = await response.json();
        console.log(data);
        setMsg(data.message);

        setTimeout(() => {
          setMsg("Redirecting to Login page");
        }, 2000);

        setTimeout(() => {
          navigate("/patientLogin");
        }, 4000);
      }
    } catch (error) {
      console.log("Error while patient registration", error);
    }
  }

  return (
    <div className="patient-register-body">
      <p className="msg-text">{msg}</p>
      <div className="register-container">
        <div className="register-sec-div">
          <p className="create-acc-text">Create An Account</p>
          <form className="form-div" onSubmit={registerHandler}>
            <div className="first-last-name-div">
              <div className="label-input-div">
                <label>Patient Name</label>
                <input
                  placeholder="Enter patient name"
                  value={registerData.username}
                  name="username"
                  type="text"
                  onChange={registerInputHandler}
                />
              </div>
              <div className="label-input-div">
                <label>Age</label>
                <input
                  placeholder="Enter patient age"
                  value={registerData.age}
                  name="age"
                  type="number"
                  onChange={registerInputHandler}
                />
              </div>
            </div>
            <div className="first-last-name-div">
              <div className="label-input-div">
                <label>Gender</label>
                <input
                  placeholder="Enter patient gender"
                  value={registerData.gender}
                  name="gender"
                  type="text"
                  onChange={registerInputHandler}
                />
              </div>
              <div className="label-input-div">
                <label>Email</label>
                <input
                  placeholder="Enter valid email id"
                  value={registerData.email}
                  name="email"
                  type="email"
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
            <Link to="/patientLogin" className="login-link">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientRegister;
