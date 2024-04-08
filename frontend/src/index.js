import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PatientMessageProvider } from "./GlobalState/PatientMessageGlobal";
import { DoctorDetailProvider } from "./GlobalState/DoctorDetailGlobal";
import { LogInProvider } from "./GlobalState/LoggedInState";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <PatientMessageProvider>
      <DoctorDetailProvider>
        <LogInProvider>
          <App />
        </LogInProvider>
      </DoctorDetailProvider>
    </PatientMessageProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
