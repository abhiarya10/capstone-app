import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Home from "./pages/Home";
import DoctorLogin from "./pages/Doctor/DoctorLogin";
import DoctorRegister from "./pages/Doctor/DoctorRegister";
import DoctorHome from "./pages/Doctor/DoctorHome";
import PatientDetail from "./pages/Doctor/PatientDetail";
import PatientLogin from "./pages/Patient/PatientLogin";
import PatientRegister from "./pages/Patient/PatientRegister";
import PatientHome from "./pages/Patient/PatientHome";
import DoctorDetail from "./pages/Patient/DoctorDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctorLogin" element={<DoctorLogin />} />
        <Route path="/doctorRegister" element={<DoctorRegister />} />
        <Route path="/doctor" element={<DoctorHome />} />
        <Route path="/patientDetail" element={<PatientDetail />} />
        <Route path="/patientLogin" element={<PatientLogin />} />
        <Route path="/patientRegister" element={<PatientRegister />} />
        <Route path="/patient" element={<PatientHome />} />
        <Route path="/doctorDetail" element={<DoctorDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
