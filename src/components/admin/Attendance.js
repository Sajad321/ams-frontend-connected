import React, { useState, Fragment, useEffect } from "react";
const apiUrl = process.env.API_URL;

function Attendance({ edit, sideBarShow }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const sendStudents = async () => {
      try {
        const response = await fetch(`${apiUrl}/students-attendance`, {
          method: "GET",
        });

        const responseData = await response.json();
        setStudents(responseData.students);
      } catch (error) {
        console.log(error.message);
      }
    };
    sendStudents();
  }, []);
  const handleEditButton = (student) => {
    edit(student);
  };
  return (
    <section className="main">
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
                  <h2 className="text">الحضور</h2>
                </div>
              </div>
            </div>
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
                    {students.map((student) => {
                      return (
                        <tr key={student.id} className="font-weight-bold">
                          <td>{student.name}</td>
                          <td>{student.inistitute}</td>
                          <td>{student.date}</td>
                          <td>
                            <button
                              onClick={() => handleEditButton(student)}
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
