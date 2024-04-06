import React from "react";
import "./Home.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-body">
      <Navbar />
      <div className="home-main-container">
        <div className="home-content">
          <Link to="/patientLogin" className="patient-link">
            Login as a Patient
          </Link>
          <Link to="/doctorLogin" className="doc-link">
            Login as a Doctor
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
