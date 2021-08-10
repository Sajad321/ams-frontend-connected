import React, { Fragment, useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import MainAdmin from "./MainAdmin";
import Institutes from "./Institutes";
import Students from "./Lists/Students";
import StudentsInstallments from "./Lists/StudentsInstallments";
import StudentsAttendance from "./Lists/StudentsAttendance";
import AddStudent from "./Forms/AddStudent";
import AddInstitute from "./Forms/AddInstitute";
const apiUrl = process.env.API_URL;

function Admin(props) {
  const [page, setPage] = useState("Main");

  const [sideBarShow, setSideBarShow] = useState(true);

  const sideEvent = () => {
    let nav = document.querySelectorAll("#nav-text");
    let sideBar = document.getElementById("side-bar");
    let topBar = document.getElementById("top-bar");
    let bottomBar = document.getElementById("bottom-bar");
    let mainView = document.getElementById("main-view");
    if (!sideBarShow) {
      console.log("showed");
      for (let i = 0; i < nav.length; i++) {
        nav[i].style.display = "block";
      }
      sideBar.className = "width-sidebar-wide sidebar rightfixed p-0";
      topBar.className =
        "width-others-wide fixed-top mr-auto admin-nav-bg top-navbar top-height logo";
      bottomBar.className =
        "width-others-wide fixed-bottom mr-auto admin-nav-bg bottom-bar";
      mainView.className = "width-others-wide mr-auto main-view";
    } else {
      console.log("cut");
      for (let i = 0; i < nav.length; i++) {
        nav[i].style.display = "none";
      }
      sideBar.className = "width-sidebar-narrow sidebar rightfixed p-0";
      topBar.className =
        "width-others-narrow fixed-top mr-auto admin-nav-bg top-navbar top-height logo";
      bottomBar.className =
        "width-others-narrow fixed-bottom mr-auto admin-nav-bg bottom-bar";
      mainView.className = "width-others-narrow mr-auto main-view";
    }
  };
  const [dataToChange, setDataToChange] = useState({});
  const AdminHeaderFunction = (Act) => {
    return (
      <AdminHeader
        logoutWithRedirect={props.logoutWithRedirect}
        Active={Act}
        MainButton={handleMainButton}
        FinalReportButton={handleFinalReportButton}
        StudentsButton={handleStudentsButton}
        StudentsInstallmentsButton={handleStudentsInstallmentsButton}
        InstitutesButton={handleInstitutesButton}
        StudentsAttendanceButton={handleStudentsAttendanceButton}
        AddStudentButton={handleAddStudentButton}
        AddInstituteButton={handleAddInstituteButton}
        sideEvent={sideEvent}
        sideBarShow={sideBarShow}
        setSideBarShow={setSideBarShow}
      />
    );
  };

  const handleMainButton = () => {
    setPage("Main");
    setDataToChange({});
  };

  const handleFinalReportButton = () => {
    setPage("Reports");
    setDataToChange({});
  };

  const handleStudentsButton = () => {
    setPage("Students");
    setDataToChange({});
  };

  const handleStudentsInstallmentsButton = () => {
    setPage("StudentsInstallments");
    setDataToChange({});
  };

  const handleInstitutesButton = () => {
    setPage("Institutes");
    setDataToChange({});
  };

  const handleStudentsAttendanceButton = () => {
    setPage("StudentsAttendance");
    setDataToChange({});
  };

  const handleAddStudentButton = () => {
    setPage("AddStudent");
    setDataToChange({});
  };

  const handleAddInstituteButton = () => {
    setPage("AddInstitute");
    setDataToChange({});
  };

  const handleEditStudentButton = (student) => {
    setDataToChange(student);
    setPage("AddStudent");
  };
  const handleEditInstituteButton = (institute) => {
    setDataToChange(institute);
    setPage("AddInstitute");
  };

  if (page == "Main") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Main: "active" })}
        {/* End of Navbar */}

        {/* Main */}
        <MainAdmin sideEvent={sideEvent} sideBarShow={sideBarShow} />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "Reports") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Reports: "active" })}
        {/* End of Navbar */}
        {/* Reports */}
        <Reports />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "Students") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Students: "active" })}
        {/* End of Navbar */}
        {/* Students */}
        <Students sideEvent={sideEvent} sideBarShow={sideBarShow} />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "StudentsInstallments") {
    return (
      <Fragment>
        {AdminHeaderFunction({ StudentsInstallments: "active" })}
        {/* End of Navbar */}
        {/* StudentsInstallments */}
        <StudentsInstallments
          edit={handleEditStudentButton}
          sideBarShow={sideBarShow}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "Institutes") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Institutes: "active" })}
        {/* End of Navbar */}
        {/* Institutes */}
        <Institutes
          edit={handleEditInstituteButton}
          sideBarShow={sideBarShow}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "StudentsAttendance") {
    return (
      <Fragment>
        {AdminHeaderFunction({ StudentsAttendance: "active" })}
        {/* End of Navbar */}
        {/* StudentsAttendance */}
        <StudentsAttendance sideBarShow={sideBarShow} />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "AddStudent") {
    return (
      <Fragment>
        {AdminHeaderFunction({ AddStudent: "active" })}
        {/* End of Navbar */}
        {/* AddStudent */}
        <AddStudent
          page={handleMainButton}
          dataToChange={dataToChange}
          sideBarShow={sideBarShow}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "AddInstitute") {
    return (
      <Fragment>
        {AdminHeaderFunction({ AddInstitute: "active" })}
        {/* End of Navbar */}
        {/* AddInstitute */}
        <AddInstitute
          page={handleMainButton}
          dataToChange={dataToChange}
          sideBarShow={sideBarShow}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  }
}

export default Admin;
