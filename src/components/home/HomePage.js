import React, { useState, Fragment, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Admin from "../admin/Admin";
import Login from "../../auth/Login";
const apiUrl = process.env.API_URL;
var { ipcRenderer } = require("electron");

const HomePage = (props) => {
  const [loading, setLoading] = useState(false);

  const logoutWithRedirect = () => {
    sessionStorage.removeItem("token");
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

  return <Admin logoutWithRedirect={logoutWithRedirect} />;
};
export default HomePage;
