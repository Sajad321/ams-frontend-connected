import React from "react";
import PropTypes from "prop-types";
import { HotKeys, GlobalHotKeys } from "react-hotkeys";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import IMG from "../../public/photos/pic.jpg";

var { ipcRenderer } = require("electron");
const keyMap = {
  ABORT: "space",
};
function StudentInfo(props) {
  const abortHandler = () => {
    // const d = document.getElementById("ss");
    // d.innerText = "HI";
    ipcRenderer.send("abort-student-attendance");
  };
  const handlers = {
    ABORT: abortHandler,
  };
  return (
    <section className="student-info-main d-flex align-items-center justify-content-center">
      <div className="row m-0">
        <div className="col-2 col-sm-3 p-0 text-center text-white">
          <div className="row">
            <div className="col-12">
              {/* <img src={IMG} className="mt-4 img-student-attendance" /> */}
            </div>
          </div>
        </div>
        <div className="col-8 col-sm-9 text-right text-white">
          <p className="mb-3">الاسم: </p>
          <p className="mb-3">المعهد: </p>
          <p className="mb-3">الدفعة: </p>
          <p className="mb-3">الاقساط: </p>
          <p className="mb-3">عدد الغياب الكلي: </p>
          <p className="mb-3">عدد الغياب المتتالي: </p>
        </div>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
          <button
            onClick={abortHandler}
            className="col-sm-4 offset-1 btn btn-danger text-white mt-5"
          >
            الغاء
          </button>
        </GlobalHotKeys>
        <button className="col-sm-4 offset-2 btn btn-success text-white mt-5">
          تسجيل حضور
        </button>
      </div>
    </section>
  );
}

export default StudentInfo;
