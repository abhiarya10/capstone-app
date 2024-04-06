import React, { useContext } from "react";
import "./PatientCard.css";
import { Link } from "react-router-dom";
import { patientDetailContext } from "../GlobalState/PatientDetailGlobal";

function PatientCard({ patient }) {
  const { setPatientGlobal } = useContext(patientDetailContext);

  function handlePatientClick() {
    setPatientGlobal(patient);
  }

  return (
    <Link
      to="/patientDetail"
      className="patient-detail-link"
      onClick={handlePatientClick}
    >
      <div className="patient-card-div">
        <p>{patient.name}</p>
        <p>{patient.age}</p>
        <p>{patient.gender}</p>
        <p>{patient.email}</p>
      </div>
    </Link>
  );
}

export default PatientCard;
