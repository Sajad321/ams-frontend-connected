import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

export function InstitutesModal(props) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const handleDateChange = (e) => {
    setDate(e.target.value);
  };
  return (
    <Modal
      show={props.show}
      onHide={() => {
        setDate(new Date().toISOString().slice(0, 10));
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
              onClick={() => {
                props.handleStartAttendanceButton(props.institute_id, date);
                setDate("");
                props.onHide();
              }}
              className="modal-add-nav"
              disabled={true}
            >
              بدء تسجيل الحضور
            </Button>
          ) : (
            <Button
              onClick={() => {
                let box = confirm("هل انت متأكد؟");
                if (box) {
                  props.handleStartAttendanceButton(props.institute_id, date);
                  setDate("");
                  props.onHide();
                }
              }}
              className="modal-add-nav"
            >
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
