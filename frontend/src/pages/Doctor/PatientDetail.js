import React, { useContext } from "react";
import "./PatientDetail.css";
import encryptedImage from "./16kb.jpg";
import dummyImage from "../../Assests/dummyImage.jpg";
import { logInContext } from "../../GlobalState/LoggedInState";
import { patientMessageContext } from "../../GlobalState/PatientMessageGlobal";

function PatientDetail() {
  const { messageGlobal } = useContext(patientMessageContext);
  const { docGlobalLoginIn } = useContext(logInContext);

  async function decryptMessageHandler() {
    const dataToDecrypt = {
      msg_id: messageGlobal.msg_id,
    };
    try {
      const response = await fetch("http://127.0.0.1:5000/decryptMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToDecrypt),
      });
      if (!response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        // Create a blob from the response data
        const blob = await response.blob();

        // Create a temporary URL for the blob
        const decryptedFileUrl = URL.createObjectURL(blob);

        // Initiate the download process by creating a temporary link
        const downloadLink = document.createElement("a");
        downloadLink.href = decryptedFileUrl;
        downloadLink.download = "decrypted_image.jpg";
        downloadLink.click();

        // Cleanup by revoking the temporary URL
        URL.revokeObjectURL(decryptedFileUrl);
      }
    } catch (error) {
      console.log("Error while decrypting image ", error);
    }
  }

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
          <p>Name: {messageGlobal.patientName}</p>
          <p>Age: {messageGlobal.patientAge}</p>
          <p>Gender: {messageGlobal.patientGender}</p>
          <p>Email: {messageGlobal.patientEmail}</p>
        </div>
        <div className="encrypted-container">
          <h1>Patient Encrypted Data</h1>
          <div className="img-div">
            {messageGlobal.image_path && <img src={dummyImage} />}
            <button onClick={decryptMessageHandler}>Download</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetail;
