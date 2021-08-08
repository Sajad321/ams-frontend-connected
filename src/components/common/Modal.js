import React from "react";
import { Modal, Button } from "react-bootstrap";

export default function MyVerticallyCenteredModal(props) {
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
