import React, { useContext } from "react";
import "./DoctorCard.css";
import { Link } from "react-router-dom";
import { doctorDetailContext } from "../GlobalState/DoctorDetailGlobal";

function DoctorCard({ doctor }) {
  const { setDoctorGlobal } = useContext(doctorDetailContext);

  function handleDoctorClick() {
    setDoctorGlobal(doctor);
  }

  return (
    <Link
      to="/doctorDetail"
      className="doc-detail-link"
      onClick={handleDoctorClick}
    >
      <div className="doc-card-div">
        <div className="fname-lname">
          <p>Dr. {doctor.fname}</p>
          <p>{doctor.lname}</p>
        </div>
        <p>{doctor.specialization}</p>
        <p>{doctor.email}</p>
      </div>
    </Link>
  );
}

export default DoctorCard;
