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
        <MainAdmin />
        <AdminFooter />
      </Fragment>
    );
  } else if (page == "Reports") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Reports: "active" })}
        {/* End of Navbar */}
        {/* Reports */}
        <Reports />
        <AdminFooter />
      </Fragment>
    );
  } else if (page == "Students") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Students: "active" })}
        {/* End of Navbar */}
        {/* Students */}
        <Students />
        <AdminFooter />
      </Fragment>
    );
  } else if (page == "StudentsInstallments") {
    return (
      <Fragment>
        {AdminHeaderFunction({ StudentsInstallments: "active" })}
        {/* End of Navbar */}
        {/* StudentsInstallments */}
        <StudentsInstallments edit={handleEditStudentButton} />
        <AdminFooter />
      </Fragment>
    );
  } else if (page == "Institutes") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Institutes: "active" })}
        {/* End of Navbar */}
        {/* Institutes */}
        <Institutes edit={handleEditInstituteButton} />
        <AdminFooter />
      </Fragment>
    );
  } else if (page == "StudentsAttendance") {
    return (
      <Fragment>
        {AdminHeaderFunction({ StudentsAttendance: "active" })}
        {/* End of Navbar */}
        {/* StudentsAttendance */}
        <StudentsAttendance />
        <AdminFooter />
      </Fragment>
    );
  } else if (page == "AddStudent") {
    return (
      <Fragment>
        {AdminHeaderFunction({ AddStudent: "active" })}
        {/* End of Navbar */}
        {/* AddStudent */}
        <AddStudent page={handleMainButton} dataToChange={dataToChange} />
        <AdminFooter />
      </Fragment>
    );
  } else if (page == "AddInstitute") {
    return (
      <Fragment>
        {AdminHeaderFunction({ AddInstitute: "active" })}
        {/* End of Navbar */}
        {/* AddInstitute */}
        <AddInstitute page={handleMainButton} dataToChange={dataToChange} />
        <AdminFooter />
      </Fragment>
    );
  }
}

export default Admin;
