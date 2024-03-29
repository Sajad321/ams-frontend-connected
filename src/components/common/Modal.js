import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { HotKeys, GlobalHotKeys } from "react-hotkeys";
import { ipcRenderer } from "electron";
const dialog = require("electron").remote.dialog;
const apiUrl = process.env.API_URL;

export function InstitutesModal(props) {
  function pad(x, width = 2, char = "0") {
    return String(x).padStart(width, char);
  }
  function toLocalISOString(dt) {
    const offset = dt.getTimezoneOffset();
    const absOffset = Math.abs(offset);
    const offHours = Math.floor(absOffset / 60);
    const offStr = pad(offHours) + ":" + pad(absOffset - offHours * 60);
    return [
      String(dt.getFullYear()),
      "-",
      pad(dt.getMonth() + 1),
      "-",
      pad(dt.getDate()),
      "T",
      pad(dt.getHours()),
      ":",
      pad(dt.getMinutes()),
      ":",
      pad(dt.getSeconds()),
      ".",
      dt.getMilliseconds(),
      offset <= 0 ? "+" : "-",
      offStr,
    ].join("");
  }
  // console.log(toLocalISOString(new Date()));
  const [date, setDate] = useState(toLocalISOString(new Date()).slice(0, 10));
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  const startAttendance = async () => {
    let response = await dialog.showMessageBox({
      buttons: ["لا", "نعم"],
      message: "هل انت متأكد؟",
      defaultId: 1,
    });
    if (response.response == 1) {
      const sendAttendance = async () => {
        try {
          const response = await fetch(
            `${apiUrl}/attendance?institute_id=${props.institute_id}&date=${date}`,
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
      props.handleStartAttendanceButton(props.institute_id, date);
      setDate("");
      props.onHide();
    }
  };
  return (
    <Modal
      show={props.show}
      onHide={() => {
        setDate(toLocalISOString(new Date()).slice(0, 10));
        props.onHide();
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dir="rtl"
      className="my-modal text-white"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          معهد {props.institute_name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4 className="text-right">ماذا تريد ان تختار ؟</h4>
        <div className="form-group row mb-0 mt-2" dir="ltr">
          <div className="col-5 offset-3">
            <input
              id="date"
              type="date"
              className="form-control text"
              onChange={handleDateChange}
              value={date}
              required
            ></input>
          </div>
          <label
            htmlFor="date"
            className="col-2 col-form-label text-center text-white modal-text-form"
          >
            التاريخ
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer
        className="m-0 align-items-center justify-content-center"
        dir="ltr"
      >
        <div className="">
          <Button
            onClick={() => {
              props.handleStudentsAttendanceButton(props.institute_id);
              props.onHide();
            }}
            className="modal-add-nav"
          >
            عرض الحضور
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              props.handleStudentsInstallmentsButton(props.institute_id);
              props.onHide();
            }}
            className="modal-add-nav"
          >
            عرض الاقساط
          </Button>
        </div>
        <div className="">
          {date == "" ? (
            <Button
              onClick={startAttendance}
              className="modal-add-nav"
              disabled={true}
            >
              بدء تسجيل الحضور
            </Button>
          ) : (
            <Button onClick={startAttendance} className="modal-add-nav">
              بدء تسجيل الحضور
            </Button>
          )}
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export function AddModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dir="rtl"
      className="text-white"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">اضافة</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-right">
        <h4>ماذا تريد ان تضيف ؟</h4>
      </Modal.Body>
      <Modal.Footer
        className="m-0 align-items-center justify-content-center"
        dir="ltr"
      >
        <div className="">
          <Button
            onClick={() => {
              props.AddInstallmentButton();
              props.onHide();
            }}
            className="modal-add-nav"
          >
            قسط
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              props.AddStudentButton();
              props.onHide();
            }}
            className="modal-add-nav"
          >
            طالب
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              props.AddInstituteButton();
              props.onHide();
            }}
            className="modal-add-nav"
          >
            معهد
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export function StudentsModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dir="rtl"
      className="text-white"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">الطلاب</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-right">
        <h4>ماذا تريد ان تختار ؟</h4>
      </Modal.Body>
      <Modal.Footer
        className="m-0 align-items-center justify-content-center"
        dir="ltr"
      >
        <div className="">
          <Button
            onClick={() => {
              props.StudentsAttendanceButton("0");
              props.onHide();
            }}
            className="modal-add-nav"
          >
            حضور الطلاب
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              props.StudentsInstallmentsButton("0");
              props.onHide();
            }}
            className="modal-add-nav"
          >
            اقساط الطلاب
          </Button>
        </div>
        <div className="">
          <Button
            onClick={() => {
              props.StudentsButton();
              props.onHide();
            }}
            className="modal-add-nav"
          >
            معلومات الطلاب
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export function StudentsInfoModal(props) {
  if (
    document.getElementById("student-img") != null &&
    document.getElementById("student-qr") != null
  ) {
    if (props.photo instanceof Blob) {
      document.getElementById("student-img").src = URL.createObjectURL(
        props.photo
      );
    }
    if (props.qr instanceof Blob) {
      document.getElementById("student-qr").src = URL.createObjectURL(props.qr);
    }
  }
  const deleteFunction = async () => {
    let response = await dialog.showMessageBox({
      buttons: ["لا", "نعم"],
      message: "هل انت متأكد؟",
    });
    if (response.response == 1) {
      props.handleDeleteButton(props.index, props.id);
      props.onHide();
    }
  };
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dir="rtl"
      className="text-white"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">الطالب</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-right">
        <div
          className="row d-flex align-content-center justify-content-center"
          dir="ltr"
        >
          <div className="col-2 col-sm-3 p-0 text-center text-white">
            <div className="row">
              <div className="col-12 mt-3">
                <img
                  id="student-img"
                  className="img-student-attendance"
                  onClick={() =>
                    ipcRenderer.send(
                      "download-button",
                      `${apiUrl}/photo?student_id=${props.id}`
                    )
                  }
                />
              </div>
              <div className="col-12 mt-3">
                <img
                  id="student-qr"
                  className="img-student-attendance"
                  onClick={() =>
                    ipcRenderer.send(
                      "download-button",
                      `${apiUrl}/qr?student_id=${props.id}`
                    )
                  }
                />
              </div>
            </div>
          </div>
          <div className="col-9 text-right text-white font-student-info">
            <p className="mb-2">الاسم: {props.name}</p>
            <p className="mb-2">المعهد: {props.institute}</p>
            <p className="mb-2">رقم الهاتف: {props.phone}</p>
            <p className="mb-2">المواليد: {props.dob}</p>
            <p className="mb-2">
              حالة الطالب: {props.banned == 1 ? "مفصول" : "مستمر"}
            </p>
          </div>
          {/* <button
            onClick={deleteFunction}
            className="btn btn-danger text-white mt-4 mr-4 w-25"
          >
            حذف
          </button>
          {props.banned == 0 ? (
            <button
              onClick={() => props.handleStudentDismiss(props.index, props.id)}
              className="btn btn-info text-white mt-4 w-25"
            >
              فصل
            </button>
          ) : (
            <button
              onClick={() => props.handleStudentReturn(props.index, props.id)}
              className="btn btn-success text-white mt-4 w-25"
            >
              ارجاع
            </button>
          )}
          <button
            onClick={() => props.handleEditButton(props.student, props.photo)}
            className="btn btn-secondary text-white mt-4 ml-4 w-25"
          >
            تعديل
          </button> */}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export function StudentInfoModal(props) {
  if (
    document.getElementById("student-img") != null &&
    document.getElementById("student-qr") != null
  ) {
    if (props.photo instanceof Blob) {
      document.getElementById("student-img").src = URL.createObjectURL(
        props.photo
      );
    }
  }
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dir="rtl"
      className="text-white"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">الطالب</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-right">
        <div
          className="row d-flex align-content-center justify-content-center"
          dir="ltr"
        >
          <div className="col-2 col-sm-3 p-0 text-center text-white">
            <div className="row">
              <div className="col-12 mt-3">
                <img id="student-img" className="img-student-attendance" />
              </div>
            </div>
          </div>
          <div className="col-9 text-right text-white font-student-info">
            <p className="mb-2">الاسم: {props.name}</p>
            <p className="mb-2">المعهد: {props.institute}</p>
            <p className="mb-2">رقم الهاتف: {props.phone}</p>
            <p className="mb-2">المواليد: {props.dob}</p>
            <p className="mb-2">
              حالة الطالب: {props.banned == 1 ? "مفصول" : "مستمر"}
            </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

const keyMap = {
  ACCEPT: "enter",
  ABORT: "space",
};

export function StudentInfoAttendanceModal({
  show,
  onHide,
  student,
  photo,
  setPhoto,
  date,
  institute_id,
  students,
  setStudents,
  getFingerprint,
  intervalId,
}) {
  const handleAttendanceButton = () => {
    const toggleAttendance = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/students-attendance?student_attendance_id=${Number(
            student.student_attendance_id
          )}&attended=${1}&time=${new Date().toLocaleString("ar-SA", {
            hour: "numeric",
            hour12: true,
            minute: "numeric",
          })}`,
          {
            method: "PATCH",
            // body: JSON.stringify({ attended: attended == 0 ? 1 : 0 }),
          }
        );

        const responseData = await response.json();

        setStudents(
          [
            ...students,
            {
              id: responseData.student_id,
              student_name: responseData.student_name,
              student_attendance_id: student.student_attendance_id,
              institute_name: student.institute_name,
              date,
            },
          ].filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i)
        );
      } catch (error) {
        console.log(error.message);
        // handleAttendanceToggle(index, id, attended);
        toast.error("حصل خطأ");
      }
    };
    toggleAttendance();
    toast.success("تم تسجيل الحضور");
  };
  const abortHandler = () => {
    // const d = document.getElementById("ss");
    // d.innerText = "HI";
    // ipcRenderer.send("abort-student-attendance");
    intervalId = setInterval(getFingerprint, 500);
    onHide();
    setPhoto({});
  };
  const acceptHandler = async () => {
    if (
      (student.incrementally_absence >= 1) |
      (student.installments.filter((installment) => installment.received == "0")
        .length !=
        0)
    ) {
      let response = await dialog.showMessageBox({
        buttons: ["لا", "نعم"],
        message: "هل انت متأكد؟",
        defaultId: 1,
      });
      if (response.response == 1) {
        handleAttendanceButton();
        onHide();
        setPhoto({});
      }
    } else {
      handleAttendanceButton();
      onHide();
      setPhoto({});
    }
    intervalId = setInterval(getFingerprint, 500);
  };
  const handlers = {
    ABORT: abortHandler,
    ACCEPT:
      student.institute_id != institute_id || student.banned == 1
        ? () => {}
        : acceptHandler,
  };
  if (document.getElementById("student-info-img") != null) {
    if (photo instanceof Blob) {
      // console.log(photo);
      document.getElementById("student-info-img").src =
        URL.createObjectURL(photo);
    }
  }
  const render_installment = (installment) => {
    const installment_received = student.installments.filter(
      (i) => i.installment_id == installment.installment_id
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
    <Modal
      show={show}
      onHide={() => {
        onHide();
        setPhoto({});
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dir="rtl"
      className="text-white"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">الطالب</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-right" dir="ltr">
        <section>
          <div className="row m-0">
            {(student.incrementally_absence >= 1) |
              (student.installments.filter(
                (installment) => installment.received == "0"
              ).length !=
                0) |
              (student.banned == 1) || student.institute_id != institute_id ? (
              <div className="col-1 btn-danger"></div>
            ) : (
              <div className="col-1 btn-success"></div>
            )}
            <div className="col-2 offset-1 p-0 text-center text-white">
              <div className="row">
                <div className="col-12">
                  <img
                    id="student-info-img"
                    className="mt-2 img-student-attendance"
                  />
                </div>
              </div>
            </div>
            <div className="col-7 text-right text-white font-weight-bold">
              <p className="mb-3">الاسم: {student.name}</p>
              <p className="mb-3">المعهد: {student.institute_name}</p>
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
          </div>
        </section>
      </Modal.Body>
      <Modal.Footer
        className="m-0 align-items-center justify-content-center"
        dir="rtl"
      >
        <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
          <Button
            onClick={abortHandler}
            className="col-3 offset-2 modal-add-nav btn-danger"
          >
            الغاء
          </Button>
          {student.institute_id != institute_id || student.banned == 1 ? (
            <Button className="col-4 modal-add-nav btn-success" disabled={true}>
              تسجيل حضور
            </Button>
          ) : (
            <Button
              onClick={acceptHandler}
              className="col-4 modal-add-nav btn-success"
            >
              تسجيل حضور
            </Button>
          )}
        </GlobalHotKeys>
      </Modal.Footer>
    </Modal>
  );
}
