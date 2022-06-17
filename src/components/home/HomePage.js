import React, { useState, Fragment, useEffect } from "react";
import Admin from "../admin/Admin";
import AttendanceOfficer from "../attendanceOfficer/Attendanceofficer";

const apiUrl = process.env.API_URL;
var { ipcRenderer } = require("electron");

const HomePage = (props) => {
  const [loading, setLoading] = useState(false);

  const logoutWithRedirect = () => {
    localStorage.removeItem("token");
    ipcRenderer.send("login");
  };

  if (JSON.parse(localStorage.getItem("token")).super == "1") {
    return <Admin logoutWithRedirect={logoutWithRedirect} />;
  } else {
    return <AttendanceOfficer logoutWithRedirect={logoutWithRedirect} />;
  }
};
export default HomePage;
