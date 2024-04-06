import React, { createContext, useState } from "react";

const patientDetailContext = createContext();

function PatientDetailProvider({ children }) {
  const [patientGlobal, setPatientGlobal] = useState({});
  const value = {
    patientGlobal,
    setPatientGlobal,
  };

  return (
    <patientDetailContext.Provider value={value}>
      {children}
    </patientDetailContext.Provider>
  );
}

export { patientDetailContext, PatientDetailProvider };
