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

  useEffect(() => {
    const callSecureApi = async () => {
      try {
        const response = await fetch(`${apiUrl}/users/` + user_id, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });

        const responseData = await response.json();

        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
  }, []);
  if (JSON.parse(localStorage.getItem("token")).auth == "1") {
    return <Admin logoutWithRedirect={logoutWithRedirect} />;
  } else {
    return <AttendanceOfficer logoutWithRedirect={logoutWithRedirect} />;
  }
};
export default HomePage;
