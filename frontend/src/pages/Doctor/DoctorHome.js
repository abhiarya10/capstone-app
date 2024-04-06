import React from "react";
import "./DoctorHome.css";
import { patientList } from "../../PatientList";
import PatientCard from "../../components/PatientCard";

function DoctorHome() {
  return (
    <div className="doc-home-body">
      <div className="doc-name-container">
        <p>Dr. Sam Rollins</p>
      </div>
      <div className="patient-list-container">
        <p>Your Patients</p>
        <div className="all-patients">
          {patientList.map((patient, index) => (
            <PatientCard patient={patient} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorHome;
