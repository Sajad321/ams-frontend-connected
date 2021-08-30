import React, { useState, Fragment, useEffect } from "react";
import { StudentInfoAttendanceModal } from "../common/Modal";
const apiUrl = process.env.API_URL;
// var { ipcRenderer } = require("electron");

function Attendance({ sideBarShow, page, attendanceStartData }) {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState({
    visible: false,
    id: "",
    student_attendance_id: "",
    name: "",
    institute_name: "",
    institute_id: "",
    installments: [],
    total_absence: "",
    incrementally_absence: "",
  });
  const [photo, setPhoto] = useState({});
  const { institute_id, date } = attendanceStartData;
  useEffect(() => {
    const sendAttendance = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/attendance?institute_id=${institute_id}&date=${date}`,
          {
            method: "POST",
          }
        );

        const responseData = await response.json();
        // setStudent({ ...student, attendance_id: responseData.attendance_id });
      } catch (error) {
        console.log(error.message);
      }
    };
    sendAttendance();
  }, []);

  // const RemoveStudentAttendance = async (student_attendance_id) => {
  //   try {
  //     const response = await fetch(
  //       `${apiUrl}/students-attendance?student_attendance_id=${student_attendance_id}&attended=0`,
  //       {
  //         method: "PATCH",
  //       }
  //     );

  //     const responseData = await response.json();
  //     // setStudents(responseData.students);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const handleRemoveButton = async (student_attendance_id, i) => {
    try {
      const response = await fetch(
        `${apiUrl}/students-attendance?student_attendance_id=${student_attendance_id}&attended=0`,
        {
          method: "PATCH",
        }
      );

      const responseData = await response.json();
      setStudents([...students].filter((student, index) => index != i));
    } catch (error) {
      console.log(error.message);
    }
  };

  // const showHandler = (id) => {
  //   // const d = document.getElementById("ss");
  //   // d.innerText = "HI";
  //   ipcRenderer.send("show-student-info", [id]);
  // };
  const getStudent = async (id) => {
    try {
      const responseJson = await fetch(
        `${apiUrl}/attendance-start?student_id=${Number(id)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        }
      );
      const responseBlob = await fetch(`${apiUrl}/photo?student_id=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });
      const responseData = await responseJson.json();
      const responseImg = await responseBlob.blob();
      setStudent({
        ...student,
        visible: true,
        id: id,
        student_attendance_id: responseData.student_attendance_id,
        name: responseData.name,
        institute_name: responseData.institute,
        institute_id: responseData.institute_id,
        installments: responseData.installments,
        total_absence: responseData.total_absence,
        incrementally_absence: responseData.incrementally_absence,
      });
      setPhoto(new Blob([responseImg], { type: "image/jpeg" }));
    } catch (error) {
      console.log(error.message);
    }
  };
  const showHandler = (id) => {
    // const d = document.getElementById("ss");
    // d.innerText = "HI";
    // ipcRenderer.send("show-student-info", [id]);
    getStudent(id);
  };

  let UPC = "";
  function qrCodeScanner(e) {
    if ((student.visible == false) & (page == "Attendance")) {
      const textInput = e.key || String.fromCharCode(e.keyCode);
      if (e.key != "Enter") {
        UPC += textInput;
      } else {
        if (
          (UPC.length > 5) &
          (UPC.split("|")[1] == "besmarty") &
          (UPC.split("|")[0].substring(0, 2) != "Tab")
        ) {
          console.log(UPC.split("|")[0]);
          showHandler(UPC.split("|")[0]);
          UPC = "";
        } else {
          console.log(UPC, "else");
          UPC = "";
        }
      }
    }
  }
  document.addEventListener("keypress", qrCodeScanner);
  // if (messages.accepted == true) {
  //   console.log(messages);
  //   handleStudentAttendance(messages.student_attendance_id, 1);
  //   messages.accepted = false;
  // }
  // ipcRenderer.on("accepted", (e, args) => {
  //   console.log(args[0]);
  //   handleStudentAttendance(args[0], 1);
  // });
  return (
    <section className="main" id="attendance">
      <div className="row m-0">
        <div
          className={
            sideBarShow
              ? "width-others-wide mr-auto main-view"
              : "width-others-narrow mr-auto main-view"
          }
          id="main-view"
        >
          <div className="row pt-md-3 pr-2 pl-2 mt-md-3 mb-5">
            <div className="col-12">
              <div className="row mt-3">
                <div className="col-12 col-md-4 order-first order-md-last">
                  <h2 className="text-right text-white">الحضور</h2>
                </div>
              </div>
            </div>

            <StudentInfoAttendanceModal
              show={student.visible}
              onHide={() => setStudent({ ...student, visible: false })}
              student={student}
              photo={photo}
              institute_id={institute_id}
              date={date}
              students={students}
              setStudents={setStudents}
            />
            <div className="col-12">
              <div className="table-responsive">
                <table
                  className="table table-striped table-bordered table-hover text"
                  dir="rtl"
                >
                  <thead className="thead-dark">
                    <tr>
                      <th>الاسم</th>
                      <th>المعهد</th>
                      <th>التاريخ</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student, index) => {
                      return (
                        <tr
                          key={student.id}
                          className="font-weight-bold text-white"
                        >
                          <td>{student.student_name}</td>
                          <td>{student.institute_name}</td>
                          <td>{student.date}</td>
                          <td>
                            <button
                              onClick={() =>
                                handleRemoveButton(
                                  student.student_attendance_id,
                                  index
                                )
                              }
                              className="btn btn-danger text-white"
                            >
                              حذف
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Attendance;
