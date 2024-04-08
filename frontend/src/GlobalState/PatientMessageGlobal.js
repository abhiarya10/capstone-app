import React, { createContext, useState } from "react";

const patientMessageContext = createContext();

function PatientMessageProvider({ children }) {
  const [messageGlobal, setMessageGlobal] = useState({});
  const value = {
    messageGlobal,
    setMessageGlobal,
  };

  return (
    <patientMessageContext.Provider value={value}>
      {children}
    </patientMessageContext.Provider>
  );
}

export { patientMessageContext, PatientMessageProvider };
