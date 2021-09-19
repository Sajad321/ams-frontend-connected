import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InstitutesModal } from "../common/Modal.js";
const apiUrl = process.env.API_URL;

function Institutes({
  edit,
  sideBarShow,
  handleStartAttendanceButton,
  handleStudentsAttendanceButton,
  handleStudentsInstallmentsButton,
}) {
  const [institutes, setInstitutes] = useState([]);
  const [modal, setModal] = useState({
    visible: false,
    institute_id: "",
    institute_name: "",
  });
  useEffect(() => {
    const getInstitutes = async () => {
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
    getInstitutes();
  }, []);

  // const handleInsitute = () => {
  //   if (confirm("هل تود البدء بتسجيل الحضور")) {
  //     console.log("yes");
  //   }
  // };

  const handleEditButton = (institute) => {
    edit(institute);
  };
  return (
    <section className="main">
      <div className="row pt-5 m-0">
        <div
          className={
            sideBarShow
              ? "width-others-wide mr-auto main-view"
              : "width-others-narrow mr-auto main-view"
          }
          id="main-view"
        >
          <div className="row pt-md-3 pr-2 pl-2 mt-md-3 mb-5" dir="rtl">
            <div className="col-12" dir="ltr">
              <div className="row mt-3">
                <div className="col-12">
                  <h2 className="text text-white">المعاهد</h2>
                </div>
              </div>
            </div>

            <InstitutesModal
              show={modal.visible}
              onHide={() =>
                setModal({
                  visible: false,
                  institute_id: "",
                  institute_name: "",
                })
              }
              handleStartAttendanceButton={handleStartAttendanceButton}
              handleStudentsInstallmentsButton={
                handleStudentsInstallmentsButton
              }
              handleStudentsAttendanceButton={handleStudentsAttendanceButton}
              institute_id={modal.institute_id}
              institute_name={modal.institute_name}
            />
            {institutes.map((institute) => {
              return (
                <div className="col-sm-3 p-2" dir="ltr" key={institute.id}>
                  <div
                    className="card card-common card-height"
                    onClick={() =>
                      setModal({
                        visible: true,
                        institute_id: institute.id,
                        institute_name: institute.name,
                      })
                    }
                  >
                    <div className="card-body">
                      <div className="row">
                        <div className="col-10 col-sm-9 text-right text-white">
                          <h5>{institute.name}</h5>
                        </div>
                        <div className="col-2 col-sm-3 p-0 text-center text-white">
                          <FontAwesomeIcon icon="users" size="3x" />
                        </div>
                        <button
                          onClick={() => handleEditButton(institute)}
                          className="btn btn-secondary text-white"
                        >
                          تعديل
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Institutes;
