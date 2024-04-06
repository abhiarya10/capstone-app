import React, { useEffect, useContext, useState } from "react";
import "./PatientHome.css";
import { patientList } from "../../PatientList";
import DoctorCard from "../../components/DoctorCard";
import { logInContext } from "../../GlobalState/LoggedInState";

function PatientHome() {
  const { globalLogIn } = useContext(logInContext);
  const [allDoctors, setAllDoctors] = useState([]);

  async function fetchDoctorHandler() {
    try {
      const response = await fetch("http://127.0.0.1:5000/fetchDoctors", {
        method: "GET",
      });
      if (!response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        const data = await response.json();
        console.log(data);
        setAllDoctors(data);
      }
    } catch (error) {
      console.log("Error occured while fetching all Doctors");
    }
  }

  useEffect(() => {
    fetchDoctorHandler();
  }, []);

  return (
    <div className="patient-home-body">
      <div className="patient-name-container">
        <p>Hello! {globalLogIn.username}</p>
      </div>
      <div className="doc-list-container">
        <p>Doctors Available</p>
        <div className="all-doc">
          {allDoctors.map((doctor, index) => (
            <DoctorCard doctor={doctor} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientHome;
