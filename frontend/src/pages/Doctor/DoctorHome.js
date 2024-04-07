import React, { useContext, useEffect, useState } from "react";
import "./DoctorHome.css";
import { logInContext } from "../../GlobalState/LoggedInState";
import PatientCard from "../../components/PatientCard";

function DoctorHome() {
  const { docGlobalLoginIn } = useContext(logInContext);
  const [messageList, setMessageList] = useState([]);

  async function patientFetchHandler() {
    const doc_email = docGlobalLoginIn.email;
    try {
      const response = await fetch("http://127.0.0.1:5000/fetchPatient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ doc_email }),
      });
      if (!response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        const data = await response.json();
        console.log(data);
        setMessageList(data);
      }
    } catch (error) {
      console.log("Error while fetching patient on Doctor page", error);
    }
  }

  useEffect(() => {
    patientFetchHandler();
  }, []);

  return (
    <div className="doc-home-body">
      <div className="doc-name-container">
        <p>
          Dr. {docGlobalLoginIn.fname} <span> </span>
          {docGlobalLoginIn.lname}
        </p>
      </div>
      <div className="patient-list-container">
        <p>Your Patients</p>
        <div className="all-patients">
          {messageList.map((message, index) => (
            <PatientCard message={message} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DoctorHome;
