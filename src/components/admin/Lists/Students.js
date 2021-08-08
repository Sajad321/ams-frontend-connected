import React, { useState, useEffect } from "react";
import { HotKeys, GlobalHotKeys } from "react-hotkeys";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const apiUrl = process.env.API_URL;
var { ipcRenderer } = require("electron");
const keyMap = {
  SHOW: "enter",
};

function Salesmen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/users-detail`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });

        const responseData = await response.json();
        setUsers(responseData.users);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUsers();
  }, []);

  const showHandler = () => {
    // const d = document.getElementById("ss");
    // d.innerText = "HI";
    ipcRenderer.send("show-student-info");
  };
  const handlers = {
    SHOW: showHandler,
  };
  const render_daily_report = (daily_report) => {
    if (daily_report == true) {
      return (
        <div className="col-2 p-0">
          <span className="circle bg-success d-block ml-4 mt-4"></span>
        </div>
      );
    } else if (daily_report == false) {
      return (
        <div className="col-2 p-0">
          <span className="circle bg-danger d-block ml-4 mt-4"></span>
        </div>
      );
    } else {
      return <div className="col-2 p-0"></div>;
    }
  };

  return (
    <section className="main">
      <div className="row pt-5 m-0">
        <div
          className="col-xl-10 col-lg-9 col-md-9 mr-auto main-view"
          id="main-view"
        >
          <div className="row pt-md-2 pr-2 pl-2 mt-md-3 mb-5" dir="rtl">
            <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
              <div id="ss" className="text-white">
                Hello
              </div>
            </GlobalHotKeys>
            <button onClick={showHandler}>hello</button>
            <div className="col-xl-3 col-sm-6 p-2" dir="ltr">
              <div className="card card-common card-height">
                <div className="card-body pb-2 pt-3 pr-3 pl-3">
                  <div className="row d-flex align-content-center justify-content-center">
                    <div className="col-2 col-sm-3 p-0 text-center text-white">
                      <div className="row">
                        <div className="col-12">
                          <FontAwesomeIcon icon="user" size="3x" />
                        </div>
                        <div className="col-12 mt-3">
                          <FontAwesomeIcon icon="user" size="3x" />
                        </div>
                      </div>
                    </div>
                    <div className="col-8 col-sm-9 text-right text-white">
                      <p className="mb-0">الاسم: </p>
                      <p className="mb-0">المعهد: </p>
                      <p className="mb-0">الدفعة: </p>
                      <p className="mb-0">رقم الهاتف: </p>
                      <p className="mb-0">المواليد: </p>
                    </div>
                    <button
                      onClick={() => handleEditButton(company)}
                      className="btn btn-secondary text-white mt-2"
                    >
                      تعديل
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {users.map((user) => {
              return (
                <div className="col-sm-6 p-2" key={user.id} dir="rtl">
                  <div className="card card-common card-height">
                    <div className="card-body">
                      <div className="row">
                        {render_daily_report(user.daily_report)}
                        <div className="col-8 col-sm-9 text-right text-secondary">
                          <h5>الاسم: {student.name}</h5>
                          <h7>المعهد: {student.institute}</h7>
                          <br />
                          <h7>رقم الهاتف: {student.phone}</h7>
                          <br />
                          <h7>المواليد: {user.dob}</h7>
                        </div>
                        <div className="col-2 col-sm-1 p-0 text-center text-secondary">
                          <FontAwesomeIcon icon="user" size="3x" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Salesmen;
