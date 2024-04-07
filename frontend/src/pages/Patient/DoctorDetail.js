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

    // Create FormData object
    const formData = new FormData();
    formData.append("message", selectedFile);
    formData.append("pName", globalLogIn.username);
    formData.append("pEmail", globalLogIn.email);
    formData.append("p_age", globalLogIn.age);
    formData.append("p_gender", globalLogIn.gender);
    formData.append("docName", doctorName);
    formData.append("docEmail", doctorGlobal.email);

    try {
      const response = await fetch("http://127.0.0.1:5000/sendMessage", {
        method: "POST",
        body: formData, // Send FormData instead of JSON.stringify
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
