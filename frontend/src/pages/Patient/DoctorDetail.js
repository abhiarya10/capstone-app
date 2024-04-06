import React, { useContext, useState } from "react";
import "./DoctorDetail.css";
import encryptedImage from "../Doctor/16kb.jpg";
import { logInContext } from "../../GlobalState/LoggedInState";
import { doctorDetailContext } from "../../GlobalState/DoctorDetailGlobal";

function DoctorDetail() {
  const { doctorGlobal } = useContext(doctorDetailContext);
  const { globalLogIn } = useContext(logInContext);
  const [selectedFile, setSelectedFile] = useState(null);

  function fileChangeHandler(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function messageSubmitHandler(e) {
    e.preventDefault();
    const doctorName = doctorGlobal.fname + " " + doctorGlobal.lname;

    if (!selectedFile) {
      console.log("No file selected");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      // Send the base64-encoded file as the message
      const messageData = {
        message: reader.result, // Use reader.result which contains the base64 string
        pName: globalLogIn.username,
        pEmail: globalLogIn.email,
        docName: doctorName,
        docEmail: doctorGlobal.email,
      };
      try {
        const response = await fetch("http://127.0.0.1:5000/sendMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        });
        if (!response.ok) {
          const data = await response.json();
          console.log(data);
        } else {
          const data = await response.json();
          console.log(data);
        }
      } catch (error) {
        console.log("Error occurred while sending message to doctor", error);
      }
    };

    reader.readAsDataURL(selectedFile);
  }

  return (
    <div className="doc-detail-body">
      <div className="patient-name-container">
        <p>Hello! {globalLogIn.username}</p>
      </div>
      <div className="detail-container">
        <div className="doc-info">
          <h1>Doctor Details</h1>
          <div className="fname-lname">
            <p>Name: Dr. {doctorGlobal.fname}</p>
            <p>{doctorGlobal.lname}</p>
          </div>
          <p>Specialist: {doctorGlobal.specialization}</p>
          <p>Email: {doctorGlobal.email}</p>
        </div>
        <div className="msg-container">
          <h1>Send Data Securely</h1>
          <form onSubmit={messageSubmitHandler}>
            <div className="file-div">
              {selectedFile ? (
                <img src={URL.createObjectURL(selectedFile)} alt="Uploaded" />
              ) : (
                <p>No File Selected</p>
              )}
            </div>

            <input type="file" accept="image/*" onChange={fileChangeHandler} />

            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DoctorDetail;
