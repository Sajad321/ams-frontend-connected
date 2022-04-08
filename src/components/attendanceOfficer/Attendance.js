import React, { useState, Fragment, useEffect } from "react";
import { StudentInfoAttendanceModal } from "../common/Modal";
import { toast } from "react-toastify";
import { animateScroll as scroll } from "react-scroll";
import { StudentInfoModal } from "../common/Modal";
const apiUrl = process.env.API_URL;
var dialog = require("electron").remote.dialog;

function Attendance({ sideBarShow, page, mainPage, attendanceStartData }) {
  const [students, setStudents] = useState([]);
  const [searchedStudents, setSearchedStudents] = useState([]);
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
  const [studentsInfoModal, setStudentsInfoModal] = useState({
    visible: false,
    id: "",
    name: "",
    institute: "",
    phone: "",
    dob: "",
    banned: "",
  });
  const [photo, setPhoto] = useState({});
  const [search, setSearch] = useState("");

  const { institute_id, date } = attendanceStartData;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
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
      toast.success("تم حذف حضور الطالب");
    } catch (error) {
      console.log(error.message);
      toast.error("حصل خطأ");
    }
  };

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
      if (responseJson.status == 401) {
        throw new Error(responseJson.status);
      }
      const responseData = await responseJson.json();
      setStudent({
        ...student,
        visible: true,
        id: id,
        name: responseData.name,
        student_attendance_id: responseData.student_attendance_id,
        institute_name: responseData.institute.name,
        institute_id: responseData.institute.id,

        banned: responseData.banned,
        installments: responseData.installments,
        total_absence: responseData.total_absence,
        incrementally_absence: Number(responseData.incrementally_absence),
      });
      if (responseData.institute.id != institute_id) {
        dialog.showErrorBox("طالب", `الطالب ${responseData.name} من معهد اخر`);
      }
    } catch (error) {
      if (error.message == 401) {
        dialog.showErrorBox("طالب", `الطالب تم تسجيله مسبقاً`);
      } else {
        console.log(error.message);
        toast.warn("حاول مرة اخرى");
      }
    }
  };
  const getStudentInfo = async (id) => {
    try {
      const responseJson = await fetch(
        `${apiUrl}/student?student_id=${Number(id)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        }
      );
      const responseData = await responseJson.json();
      setStudentsInfoModal({
        ...studentsInfoModal,
        visible: true,
        id: id,
        name: responseData.name,
        institute: responseData.institute.name,
        institute_id: responseData.institute.id,
        phone: responseData.phone,
        dob: responseData.dob,
        banned: responseData.banned,
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const getPhoto = async (id) => {
    try {
      const responseBlob = await fetch(`${apiUrl}/photo?student_id=${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseImg = await responseBlob.blob();

      setPhoto(new Blob([responseImg], { type: "image/jpeg" }));
    } catch (error) {
      console.log(error.message);
    }
  };
  const showHandler = (id) => {
    if (students.filter((s) => s.id == id).length == 0) {
      getStudent(id);
      getPhoto(id);
    } else {
      dialog.showErrorBox("طالب", "مسجل مسبقاً");
    }
  };
  let UPC = "";
  function qrCodeScanner(e) {
    console.log(e);
    if ((student.visible == false) & (page == "Attendance")) {
      const textInput = e.key || String.fromCharCode(e.keyCode);
      if (e.key != "Enter") {
        if (e.key != "Shift") {
          UPC += textInput;
        }
      } else {
        if (
          (UPC.length > 5) &
          ((UPC.split("|")[1] == "besmarty") |
            (UPC.split("|")[1] == "Unidentifiedثسةشقفغ")) &
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
  const handleSearchButton = (e) => {
    e.preventDefault();
    const reg = new RegExp(search, "i");
    setSearchedStudents([...students].filter((d) => d.student_name.match(reg)));
  };
  scroll.scrollToBottom({ duration: 0.5 });
  return (
    <section
      className="main"
      id="attendance"
      onKeyDown={qrCodeScanner}
      tabIndex="0"
    >
      <div className="row m-0">
        <div
          className={
            sideBarShow
              ? "width-others-wide mr-auto main-view"
              : "width-others-narrow mr-auto main-view"
          }
          id="main-view"
        >
          <div className="row pt-5 pr-2 pl-2 mt-3 mb-5">
            <div className="col-12 mb-3">
              <div className="row pt-3">
                <div className="col-2 align-self-center">
                  <button
                    onClick={mainPage}
                    className="btn btn-danger text-white"
                  >
                    انهاء عملية تسجيل الحضور
                  </button>
                </div>
                <form onSubmit={handleSearchButton} className="col-5">
                  <div className="form-group row mt-1">
                    <div className="col-2 text">
                      <button
                        type="submit"
                        className="btn btn-secondary btn-sm mt-1"
                      >
                        ابحث
                      </button>
                    </div>

                    <div className="col-7">
                      <input
                        type="text"
                        className="form-control text"
                        id="searchStudent"
                        onChange={handleSearchChange}
                        placeholder="ابحث"
                      ></input>
                    </div>
                  </div>
                </form>
                <div className="col-5">
                  <h2 className="text-right text-white">الحضور</h2>
                </div>
              </div>
            </div>
            <StudentInfoModal
              show={studentsInfoModal.visible}
              onHide={() =>
                setStudentsInfoModal({ ...studentsInfoModal, visible: false })
              }
              id={studentsInfoModal.id}
              name={studentsInfoModal.name}
              institute={studentsInfoModal.institute}
              phone={studentsInfoModal.phone}
              dob={studentsInfoModal.dob}
              banned={studentsInfoModal.banned}
              photo={photo}
            />

            <StudentInfoAttendanceModal
              show={student.visible}
              onHide={() => setStudent({ ...student, visible: false })}
              student={student}
              photo={photo}
              setPhoto={setPhoto}
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
                      <th>ت</th>
                      <th>الاسم</th>
                      <th>المعهد</th>
                      <th>التاريخ</th>
                      <th>&nbsp;</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {search != ""
                      ? searchedStudents.map((student, index) => {
                          return (
                            <tr
                              key={student.id}
                              className="font-weight-bold text-white"
                            >
                              <td>{index + 1}</td>
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
                              <td>
                                <button
                                  onClick={() => {
                                    getPhoto(student.id);
                                    getStudentInfo(student.id);
                                  }}
                                  className="btn btn-secondary text-white"
                                >
                                  اظهار
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      : students.map((student, index) => {
                          return (
                            <tr
                              key={student.id}
                              className="font-weight-bold text-white"
                            >
                              <td>{index + 1}</td>
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
                              <td>
                                <button
                                  onClick={() => {
                                    getPhoto(student.id);
                                    getStudentInfo(student.id);
                                  }}
                                  className="btn btn-secondary text-white"
                                >
                                  اظهار
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
