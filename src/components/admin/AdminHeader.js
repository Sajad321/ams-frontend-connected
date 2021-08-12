import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddModal, StudentsModal } from "../common/Modal";
function AdminHeader(props) {
  const [addModalShow, setAddModalShow] = useState(false);
  const [studentsModalShow, setStudentsModalShow] = useState(false);
  return (
    <nav className="navbar navbar-dark navbar-expand-md">
      <AddModal
        show={addModalShow}
        onHide={() => setAddModalShow(false)}
        AddStudentButton={props.AddStudentButton}
        AddInstituteButton={props.AddInstituteButton}
      />
      <StudentsModal
        show={studentsModalShow}
        onHide={() => setStudentsModalShow(false)}
        StudentsAttendanceButton={props.StudentsAttendanceButton}
        StudentsInstallmentsButton={props.StudentsInstallmentsButton}
        StudentsButton={props.StudentsButton}
      />
      <div className="row">
        <div
          className="width-sidebar-wide sidebar rightfixed p-0"
          id="side-bar"
        >
          <div className="r-navbar" id="nav-bar" dir="rtl">
            <nav className="nav">
              <div>
                {" "}
                <a
                  href="#"
                  className="nav_logo"
                  onClick={() => {
                    props.sideEvent();
                    props.setSideBarShow(!props.sideBarShow);
                  }}
                >
                  {" "}
                  <FontAwesomeIcon
                    icon="bars"
                    className="nav_logo-icon"
                    color="white"
                    size="2x"
                  />
                  <span className="nav_logo-name" id="nav-text">
                    القائمة
                  </span>{" "}
                </a>
                <div className="nav_list">
                  {" "}
                  <a
                    href="#"
                    className="nav_link active"
                    onClick={props.MainButton}
                  >
                    {" "}
                    <FontAwesomeIcon
                      icon="home"
                      className="nav_logo-icon"
                      color="white"
                      size="2x"
                    />
                    <span className="nav_name" id="nav-text">
                      الرئيسية
                    </span>{" "}
                  </a>{" "}
                  <a
                    href="#"
                    className="nav_link"
                    onClick={props.InstitutesButton}
                  >
                    {" "}
                    <FontAwesomeIcon
                      icon="school"
                      className="nav_logo-icon"
                      color="white"
                      size="2x"
                    />
                    <span className="nav_name" id="nav-text">
                      المعاهد
                    </span>{" "}
                  </a>{" "}
                  <a
                    href="#"
                    className="nav_link"
                    onClick={() => setStudentsModalShow(true)}
                  >
                    {" "}
                    <FontAwesomeIcon
                      icon="user-graduate"
                      className="nav_logo-icon"
                      color="white"
                      size="2x"
                    />
                    <span className="nav_name" id="nav-text">
                      الطلاب
                    </span>{" "}
                  </a>{" "}
                  <a
                    href="#"
                    className="nav_link"
                    onClick={() => setAddModalShow(true)}
                  >
                    {" "}
                    <FontAwesomeIcon
                      icon="plus-circle"
                      className="nav_logo-icon"
                      color="white"
                      size="2x"
                    />
                    <span className="nav_name" id="nav-text">
                      اضافة
                    </span>{" "}
                  </a>{" "}
                </div>
              </div>{" "}
              <a
                href="#"
                className="nav_link_bottom"
                onClick={props.logoutWithRedirect}
              >
                {" "}
                <FontAwesomeIcon
                  icon="cog"
                  className="nav_logo-icon"
                  color="white"
                  size="2x"
                />
                <span className="nav_name" id="nav-text">
                  الاعدادات
                </span>{" "}
              </a>
            </nav>
          </div>
          <div
            className="width-others-wide fixed-top mr-auto admin-nav-bg top-navbar top-height logo"
            id="top-bar"
          >
            <div className="row justify-content-center">
              <div className="col-auto">
                <NavLink to="/" className="logo-text">
                  نظام ادارة حسابات وحضور حسين الهاشمي
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminHeader;
