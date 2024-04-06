import React, { useContext } from "react";
import "./PatientDetail.css";
import encryptedImage from "./16kb.jpg";
import { logInContext } from "../../GlobalState/LoggedInState";
import { patientDetailContext } from "../../GlobalState/PatientDetailGlobal";

function PatientDetail() {
  const { patientGlobal } = useContext(patientDetailContext);
  const { globalLogIn } = useContext(logInContext);

  return (
    <div className="patient-detail-body">
      <div className="doc-name-container">
        <p>Hello! {globalLogIn.username}</p>
      </div>
      <div className="detail-container">
        <div className="patient-info">
          <h1>Patient Details</h1>
          <p>Name: {patientGlobal.name}</p>
          <p>Age: {patientGlobal.age}</p>
          <p>Gender: {patientGlobal.gender}</p>
          <p>Email: {patientGlobal.email}</p>
        </div>
        <div className="encrypted-container">
          <h1>Patient Encrypted Data</h1>
          <div>
            <img src={encryptedImage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetail;
