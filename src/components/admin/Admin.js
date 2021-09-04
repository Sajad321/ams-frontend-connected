import React, { Fragment, useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import MainAdmin from "./MainAdmin";
import Institutes from "./Institutes";
import Attendance from "./Attendance";
import Students from "./Lists/Students";
import StudentsInstallments from "./Lists/StudentsInstallments";
import StudentsAttendance from "./Lists/StudentsAttendance";
import AddStudent from "./Forms/AddStudent";
import AddInstitute from "./Forms/AddInstitute";
import AddInstallment from "./Forms/AddInstallment";
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
  const [attendanceStartData, setAttendanceStartData] = useState({
    institute_id: "",
    date: "",
  });

  const [institutes, setInstitutes] = useState([]);
  const [institute, setInstitute] = useState("0");
  const [installmentsData, setInstallmentsData] = useState({
    students: [],
    installments: [],
  });
  const [attendanceData, setAttendanceData] = useState({
    students: [],
    attendance: [],
  });
  const [searchedInstallmentsData, setSearchedInstallmentsData] = useState({
    ...installmentsData,
  });
  const [searchedAttendanceData, setSearchedAttendanceData] = useState({
    ...attendanceData,
  });

  const getStuff = async () => {
    try {
      const response = await fetch(`${apiUrl}/institute`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseData = await response.json();
      setInstitutes(responseData.institutes);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getInstallments = async () => {
    try {
      const response = await fetch(`${apiUrl}/student-install`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });
      const responseData = await response.json();
      setInstallmentsData({
        students: responseData.students.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }),
        installments: responseData.installments.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }),
      });

      setSearchedInstallmentsData({
        students: responseData.students.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }),
        installments: responseData.installments.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }),
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const getAttendance = async () => {
    try {
      const response = await fetch(`${apiUrl}/students-attendance`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });
      const responseData = await response.json();
      setAttendanceData({
        students: responseData.students.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }),
        attendance: responseData.attendance.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }),
      });
      setSearchedAttendanceData({
        students: responseData.students.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }),
        attendance: responseData.attendance.sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }),
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getStuff();
    getInstallments();
    getAttendance();
  }, []);

  const AdminHeaderFunction = (Act) => {
    return (
      <AdminHeader
        logoutWithRedirect={props.logoutWithRedirect}
        Active={Act}
        MainButton={handleMainButton}
        StudentsButton={handleStudentsButton}
        StudentsInstallmentsButton={handleStudentsInstallmentsButton}
        InstitutesButton={handleInstitutesButton}
        StudentsAttendanceButton={handleStudentsAttendanceButton}
        AddStudentButton={handleAddStudentButton}
        AddInstituteButton={handleAddInstituteButton}
        AddInstallmentButton={handleAddInstallmentButton}
        sideEvent={sideEvent}
        sideBarShow={sideBarShow}
        setSideBarShow={setSideBarShow}
      />
    );
  };

  const handleMainButton = () => {
    setPage("Main");
    setDataToChange({});
    getStuff();
    getInstallments();
    getAttendance();
  };

  const handleInstitutesButton = () => {
    getStuff();
    getInstallments();
    getAttendance();
    setPage("Institutes");
    setDataToChange({});
  };

  const handleStudentsButton = () => {
    setPage("Students");
    setDataToChange({});
  };

  const handleStartAttendanceButton = (institute_id, date) => {
    setPage("Attendance");
    setAttendanceStartData({ institute_id, date });
  };

  const handleStudentsInstallmentsButton = (institute_id) => {
    setInstitute(institute_id);
    setPage("StudentsInstallments");
    setDataToChange({});
  };

  const handleStudentsAttendanceButton = (institute_id) => {
    setInstitute(institute_id);
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
  const handleAddInstallmentButton = () => {
    setPage("AddInstallment");
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
  const handleEditInstallmentButton = (installment) => {
    setDataToChange(installment);
    setPage("AddInstallment");
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
  } else if (page == "Students") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Students: "active" })}
        {/* End of Navbar */}
        {/* Students */}
        <Students
          sideEvent={sideEvent}
          sideBarShow={sideBarShow}
          edit={handleEditStudentButton}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "StudentsInstallments") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Students: "active" })}
        {/* End of Navbar */}
        {/* StudentsInstallments */}
        <StudentsInstallments
          edit={handleEditInstallmentButton}
          sideBarShow={sideBarShow}
          institutes={institutes}
          institute={institute}
          data={installmentsData}
          setData={setInstallmentsData}
          searchedData={searchedInstallmentsData}
          setSearchedData={setSearchedInstallmentsData}
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
          handleStartAttendanceButton={handleStartAttendanceButton}
          handleStudentsInstallmentsButton={handleStudentsInstallmentsButton}
          handleStudentsAttendanceButton={handleStudentsAttendanceButton}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "Attendance") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Main: "active" })}
        {/* End of Navbar */}
        {/* Reports */}
        <Attendance
          sideBarShow={sideBarShow}
          page={page}
          mainPage={handleMainButton}
          attendanceStartData={attendanceStartData}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "StudentsAttendance") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Students: "active" })}
        {/* End of Navbar */}
        {/* StudentsAttendance */}
        <StudentsAttendance
          sideBarShow={sideBarShow}
          institutes={institutes}
          institute={institute}
          data={attendanceData}
          setData={setAttendanceData}
          searchedData={searchedAttendanceData}
          setSearchedData={setSearchedAttendanceData}
        />
        <AdminFooter sideBarShow={sideBarShow} />
      </Fragment>
    );
  } else if (page == "AddStudent") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Add: "active" })}
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
        {AdminHeaderFunction({ Add: "active" })}
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
  } else if (page == "AddInstallment") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Add: "active" })}
        {/* End of Navbar */}
        {/* AddInstitute */}
        <AddInstallment
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
