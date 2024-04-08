import React, { useContext } from "react";
import "./PatientCard.css";
import { Link } from "react-router-dom";
import { patientMessageContext } from "../GlobalState/PatientMessageGlobal";

function PatientCard({ message }) {
  const { setMessageGlobal } = useContext(patientMessageContext);

  function handlePatientClick() {
    setMessageGlobal(message);
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
