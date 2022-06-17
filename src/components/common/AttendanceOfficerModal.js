import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
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
  const [date, setDate] = useState(toLocalISOString(new Date()).slice(0, 10));
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  const startAttendance = async () => {
    let response = await dialog.showMessageBox({
      buttons: ["لا", "نعم"],
      message: "هل انت متأكد؟",
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
