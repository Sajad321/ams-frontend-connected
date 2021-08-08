import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function AdminHeader(props) {
  const barsclicked = () => {
    let visible = document.querySelectorAll("#visible");
    let removed = document.querySelectorAll("#removed");
    let staySide = document.querySelectorAll("#stay-side");
    let sideBar = document.getElementById("side-bar");
    let topBar = document.getElementById("top-bar");
    let bottomBar = document.getElementById("bottom-bar");
    let mainView = document.getElementById("main-view");
    for (let j = 0; j < staySide.length; j++) {
      if (removed[j].style.display == "none") {
        removed[j].style.display = "block";
        staySide[j].className = "col-2 offset-2 side-bars";
      } else {
        removed[j].style.display = "none";
        staySide[j].className = "col-2 offset-3 side-bars";
      }
    }
    for (let i = 0; i < visible.length; i++) {
      if (visible[i].style.visibility == "hidden") {
        visible[i].style.visibility = "visible";
        sideBar.className = "col-xl-2 col-lg-3 col-md-3 sidebar rightfixed p-0";
        topBar.className =
          "col-xl-10 col-lg-9 col-md-9 fixed-top mr-auto admin-nav-bg top-navbar top-height logo";
        bottomBar.className =
          "col-xl-10 col-lg-9 col-md-9 fixed-bottom mr-auto admin-nav-bg bottom-bar";
        mainView.className = "col-xl-10 col-lg-9 col-md-9 mr-auto main-view";
      } else {
        visible[i].style.visibility = "hidden";
        sideBar.className = "col-1 sidebar rightfixed p-0";
        topBar.className =
          "col-11 fixed-top mr-auto admin-nav-bg top-navbar top-height logo";
        bottomBar.className =
          "col-11 fixed-bottom mr-auto admin-nav-bg bottom-bar";
        mainView.className = "col-11 mr-auto main-view";
      }
    }
  };
  return (
    <nav className="navbar navbar-dark navbar-expand-md">
      <div className="row">
        <div
          className="col-xl-2 col-lg-3 col-md-3 sidebar rightfixed p-0"
          id="side-bar"
        >
          <ul className="navbar-nav d-block">
            <div className="d-flex flex-column">
              <div className="d-block">
                <li className="nav-item">
                  <div className="row admin-list-toggle side-bars">
                    <div className="col-5 offset-1" id="removed">
                      <p className="admin-text">القائمة</p>
                    </div>
                    <div className="col-2 offset-2" id="stay-side">
                      <button
                        className="admin-toggle-button bars"
                        type="button"
                        onClick={barsclicked}
                      >
                        <FontAwesomeIcon
                          icon="bars"
                          className="bars"
                          color="white"
                          size="2x"
                        />
                      </button>
                    </div>
                  </div>
                </li>
                <li
                  className={"nav-item admin-list " + props.Active.Main}
                  id="visible"
                >
                  <a className="nav-link" onClick={props.MainButton}>
                    الرئيسية
                  </a>
                </li>
                <li
                  className={"nav-item admin-list " + props.Active.Institutes}
                  id="visible"
                >
                  <a className="nav-link" onClick={props.InstitutesButton}>
                    المعاهد
                  </a>
                </li>
                <li
                  className="nav-item dropdown admin-list top-dropdown"
                  id="visible"
                >
                  <a
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    الطلاب
                  </a>
                  <div
                    className="dropdown-menu admin-dropdown-list"
                    aria-labelledby="navbarShow"
                  >
                    <a
                      className={
                        "dropdown-item admin-dropdown-item " +
                        props.Active.StudentsAttendance
                      }
                      onClick={props.StudentsAttendanceButton}
                      href="#"
                    >
                      حضور الطلاب
                    </a>
                    <a
                      className={
                        "dropdown-item admin-dropdown-item " +
                        props.Active.StudentsInstallments
                      }
                      onClick={props.StudentsInstallmentsButton}
                      href="#"
                    >
                      اقساط الطلاب
                    </a>
                    <a
                      className={
                        "dropdown-item admin-dropdown-item " +
                        props.Active.Students
                      }
                      onClick={props.StudentsButton}
                      href="#"
                    >
                      معلومات الطلاب
                    </a>
                  </div>
                </li>
                <li
                  className="nav-item dropdown admin-list below-dropdown"
                  id="visible"
                >
                  <a
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    اضافة
                  </a>
                  <div
                    className="dropdown-menu admin-dropdown-list"
                    aria-labelledby="navbarAdd"
                  >
                    <a
                      className={
                        "dropdown-item admin-dropdown-item " +
                        props.Active.AddStudent
                      }
                      onClick={props.AddStudentButton}
                      href="#"
                    >
                      طالب
                    </a>
                    <a
                      className={
                        "dropdown-item admin-dropdown-item " +
                        props.Active.AddInstitute
                      }
                      onClick={props.AddInstituteButton}
                      href="#"
                    >
                      معهد
                    </a>
                  </div>
                </li>
              </div>
              <div className="admin-system">
                <li className="nav-item">
                  <div className="row admin-list-toggle side-bars">
                    <div className="col-5 offset-1" id="removed">
                      <p className="admin-text">الاعدادات</p>
                    </div>
                    <div className="col-2 offset-2" id="stay-side">
                      <button
                        className="admin-toggle-button bars"
                        type="button"
                      >
                        <FontAwesomeIcon
                          icon="cog"
                          className="bars"
                          color="white"
                          size="2x"
                        />
                      </button>
                    </div>
                  </div>
                </li>
              </div>
            </div>
          </ul>
        </div>
        <div
          className="col-xl-10 col-lg-9 col-md-9 fixed-top mr-auto admin-nav-bg top-navbar top-height logo"
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
    </nav>
  );
}

export default AdminHeader;
