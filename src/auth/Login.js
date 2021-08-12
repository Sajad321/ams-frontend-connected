import React, { useState } from "react";
import PropTypes from "prop-types";

const { ipcRenderer } = require("electron");

async function loginUser(credentials) {
  return { token: "test1s" };
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password,
    });
    setToken(token);
    if (token.token) {
      ipcRenderer.send("finished-login");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center main pb-5 text-white ">
      <form onSubmit={handleSubmit} className="w-50">
        <h3 className="text-center mb-3">Sign In</h3>

        <div className="form-group">
          <label>Username</label>
          <input
            type="username"
            className="form-control"
            placeholder="Enter Username"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Login
        </button>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
