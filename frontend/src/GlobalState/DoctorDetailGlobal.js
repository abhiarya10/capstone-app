import React, { createContext, useState } from "react";

const doctorDetailContext = createContext();

function DoctorDetailProvider({ children }) {
  const [doctorGlobal, setDoctorGlobal] = useState({});
  const value = {
    doctorGlobal,
    setDoctorGlobal,
  };

  return (
    <doctorDetailContext.Provider value={value}>
      {children}
    </doctorDetailContext.Provider>
  );
}

export { doctorDetailContext, DoctorDetailProvider };
