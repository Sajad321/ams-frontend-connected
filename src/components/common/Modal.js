import React from "react";
import { Modal, Button } from "react-bootstrap";

export function InstitutesModal(props) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dir="rtl"
      className="my-modal text-white"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          معهد البنوك
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-right">
        <h4>ماذا تريد ان تختار ؟</h4>
      </Modal.Body>
      <Modal.Footer className="row m-0" dir="ltr">
        <div className="col-4 offset-2">
          <Button onClick={props.onHide}>عرض الحضور</Button>
        </div>
        <div className="col-5 offset-1">
          <Button onClick={props.onHide}>بدء تسجيل الحضور</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export function AddModal(props) {
  return (
    <Modal
      {...props}
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
      {...props}
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
              props.StudentsAttendanceButton();
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
              props.StudentsInstallmentsButton();
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
