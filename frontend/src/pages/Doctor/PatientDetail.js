import React, { useContext } from "react";
import "./PatientDetail.css";
import encryptedImage from "./16kb.jpg";
import { logInContext } from "../../GlobalState/LoggedInState";
import { patientDetailContext } from "../../GlobalState/PatientDetailGlobal";

function PatientDetail() {
  const { patientGlobal } = useContext(patientDetailContext);
  const { docGlobalLoginIn } = useContext(logInContext);

  return (
    <div className="patient-detail-body">
      <div className="doc-name-container">
        <p>
          Dr. {docGlobalLoginIn.fname} <span> </span>
          {docGlobalLoginIn.lname}
        </p>
      </div>
      <div className="detail-container">
        <div className="patient-info">
          <h1>Patient Details</h1>
          <p>Name: {patientGlobal.patientName}</p>
          <p>Age: {patientGlobal.patientAge}</p>
          <p>Gender: {patientGlobal.patientGender}</p>
          <p>Email: {patientGlobal.patientEmail}</p>
        </div>
        <div className="encrypted-container">
          <h1>Patient Encrypted Data</h1>
          <div className="img-div">
            <img src={patientGlobal.image_path} />
            <button>Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetail;
