import React, { useState, Fragment, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Admin from "../admin/Admin";
const apiUrl = process.env.API_URL;

const HomePage = (props) => {
  const [loading, setLoading] = useState(false);
  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

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

  if (false) {
    return (
      <div>
        {!isAuthenticated && (
          <div className="jumbotron">
            <div className="row row-content justify-content-center">
              <div className="col-12 col-sm-4">
                <button
                  onClick={loginWithRedirect}
                  className="btn btn-primary btn-block btn-lg"
                >
                  <FontAwesomeIcon icon="sign-in-alt" /> Log in
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return <Admin logoutWithRedirect={logoutWithRedirect} />;
  }
};
export default HomePage;
