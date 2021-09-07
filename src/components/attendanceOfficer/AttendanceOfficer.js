import React, { Fragment, useState, useEffect } from "react";
import AdminHeader from "./Header";
import AdminFooter from "./Footer";
import MainAdmin from "./MainAdmin";
import Institutes from "./Institutes";
import Attendance from "./Attendance";
import Students from "./Lists/Students";
import StudentsAttendance from "./Lists/StudentsAttendance";
import AddStudent from "./Forms/AddStudent";
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
      // console.log("showed");
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
      // console.log("cut");
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
  const [attendanceData, setAttendanceData] = useState({
    students: [],
    attendance: [],
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
    getAttendance();
  }, []);

  const AdminHeaderFunction = (Act) => {
    return (
      <AdminHeader
        logoutWithRedirect={props.logoutWithRedirect}
        Active={Act}
        MainButton={handleMainButton}
        StudentsButton={handleStudentsButton}
        InstitutesButton={handleInstitutesButton}
        StudentsAttendanceButton={handleStudentsAttendanceButton}
        AddStudentButton={handleAddStudentButton}
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
    getAttendance();
  };

  const handleInstitutesButton = () => {
    getStuff();
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

  const handleStudentsAttendanceButton = (institute_id) => {
    setInstitute(institute_id);
    setPage("StudentsAttendance");
    setDataToChange({});
  };

  const handleAddStudentButton = () => {
    setPage("AddStudent");
    setDataToChange({});
  };

  const handleEditStudentButton = (student) => {
    setDataToChange(student);
    setPage("AddStudent");
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
  } else if (page == "Institutes") {
    return (
      <Fragment>
        {AdminHeaderFunction({ Institutes: "active" })}
        {/* End of Navbar */}
        {/* Institutes */}
        <Institutes
          sideBarShow={sideBarShow}
          handleStartAttendanceButton={handleStartAttendanceButton}
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
  }
}

export default Admin;
