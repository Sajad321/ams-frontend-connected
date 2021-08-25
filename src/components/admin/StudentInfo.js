import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { HotKeys, GlobalHotKeys } from "react-hotkeys";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IMG from "../../public/photos/pic.jpg";
import { useParams } from "react-router-dom";

var { ipcRenderer } = require("electron");
const keyMap = {
  ACCEPT: "enter",
  ABORT: "space",
};
const apiUrl = process.env.API_URL;
function StudentInfo({ history, match }) {
  let { id } = useParams();
  const [student, setStudent] = useState({
    student_attendance_id: "",
    name: "",
    institute: "",
    batch_num: "",
    installments: [],
    total_absence: "",
    incrementally_absence: "",
  });
  const [photo, setPhoto] = useState({});
  // console.log(id, history, match);
  // console.log(window.location.hash);
  useEffect(() => {
    const getStudent = async () => {
      try {
        const responseJson = await fetch(
          `${apiUrl}/attendance-start?student_id=${id}`,
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
          student_attendance_id: responseData.student_attendance_id,
          name: responseData.name,
          institute: responseData.institute,
          batch_num: responseData.batch_num,
          installments: responseData.installments,
          total_absence: responseData.total_absence,
          incrementally_absence: responseData.incrementally_absence,
        });
        setPhoto(new Blob([responseImg], { type: "image/jpeg" }));
      } catch (error) {
        console.log(error.message);
      }
    };
    getStudent();
  }, []);

  const handleAttendanceButton = () => {
    const toggleAttendance = async () => {
      try {
        const response = await fetch(`${apiUrl}/attendance/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ attended: attended == 0 ? 1 : 0 }),
        });

        const responseData = await response.json();
      } catch (error) {
        console.log(error.message);
        handleAttendanceToggle(index, id, attended);
        toast.warn("حصل خطأ");
      }
    };
    toggleAttendance();
    toast.success("تم تسجيل الحضور");
  };
  const abortHandler = () => {
    // const d = document.getElementById("ss");
    // d.innerText = "HI";
    ipcRenderer.send("abort-student-attendance");
  };
  const acceptHandler = () => {
    // const d = document.getElementById("ss");
    // d.innerText = "HI";
    ipcRenderer.send("accept-student-attendance", [
      student.student_attendance_id,
    ]);
  };
  const handlers = {
    ABORT: abortHandler,
    ACCEPT: acceptHandler,
  };

  if (photo instanceof Blob) {
    console.log(photo);
    document.getElementById("student-info-img").src = URL.createObjectURL(
      photo
    );
  }
  // var fr = new FileReader();
  // if (student.photo != {}) {
  //   fr.onload = function (event) {
  //     document.getElementById("student-info-img").src = event.target.result;
  //   };
  //   // fr.readAsDataURL(student.photo);
  //   fr.readAsDataURL(student.photo[0]);
  // }
  const render_installment = (installment) => {
    console.log(student);
    // document.getElementById("student-info-img").src = URL.createObjectURL(
    //   student.photo
    // );
    const installment_received = student.installments.filter(
      (installment) => installment.installment_id == installment.installment_id
    )[0];
    if (
      installment_received.received == "1" &&
      installment.installment_id == installment_received.installment_id
    ) {
      return (
        <FontAwesomeIcon
          icon="check-circle"
          size="2x"
          color="green"
          key={installment_received.installment_id}
        />
      );
    } else if (
      installment_received.received == "0" &&
      installment.installment_id == installment_received.installment_id
    ) {
      return (
        <FontAwesomeIcon
          icon="times-circle"
          size="2x"
          color="red"
          key={installment_received.installment_id}
        />
      );
    }
  };
  return (
    <section className="student-info-main d-flex align-items-center justify-content-center">
      <div className="row m-0">
        <div className="col-2 col-sm-3 p-0 text-center text-white">
          <div className="row">
            <div className="col-12">
              <img
                id="student-info-img"
                className="mt-3 img-student-attendance"
              />
            </div>
          </div>
        </div>
        <div className="col-8 col-sm-9 text-right text-white">
          <p className="mb-3">الاسم: {student.name}</p>
          <p className="mb-3">المعهد: {student.institute}</p>
          <p className="mb-3">الدفعة: {student.batch_num}</p>
          <p className="mb-3">
            {student.installments.map((installment) => {
              return render_installment(installment);
            })}{" "}
            :الاقساط
          </p>
          <p className="mb-3">عدد الغياب الكلي: {student.total_absence}</p>
          <p className="mb-3">
            عدد الغياب المتتالي: {student.incrementally_absence}
          </p>
        </div>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
          <button
            onClick={abortHandler}
            className="col-5 offset-1 btn btn-danger text-white mt-5"
          >
            الغاء
          </button>
          <button
            onClick={acceptHandler}
            className="col-5 offset-1 btn btn-success text-white mt-5"
          >
            تسجيل حضور
          </button>
        </GlobalHotKeys>
      </div>
    </section>
  );
}

export default StudentInfo;
