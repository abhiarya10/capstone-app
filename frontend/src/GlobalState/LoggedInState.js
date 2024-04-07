import React, { createContext, useState } from "react";

const logInContext = createContext();

function LogInProvider({ children }) {
  const [globalLogIn, setGlobalLogIn] = useState({});
  const [docGlobalLoginIn, setDocGlobalLogin] = useState({});
  const value = {
    globalLogIn,
    setGlobalLogIn,
    docGlobalLoginIn,
    setDocGlobalLogin,
  };

  return (
    <logInContext.Provider value={value}>{children}</logInContext.Provider>
  );
}

export { logInContext, LogInProvider };
