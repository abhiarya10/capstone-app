import React, { useContext } from "react";
import "./PatientCard.css";
import { Link } from "react-router-dom";
import { patientDetailContext } from "../GlobalState/PatientDetailGlobal";

function PatientCard({ message }) {
  const { setPatientGlobal } = useContext(patientDetailContext);

  function handlePatientClick() {
    setPatientGlobal(message);
  }

  return (
    <Link
      to="/patientDetail"
      className="patient-detail-link"
      onClick={handlePatientClick}
    >
      <div className="patient-card-div">
        <p>{message.patientName}</p>
        <p>{message.patientAge}</p>
        <p>{message.patientGender}</p>
        <p>{message.patientEmail}</p>
      </div>
    </Link>
  );
}

export default PatientCard;
