import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const apiUrl = process.env.API_URL;

function MainAdmin({ sideBarShow }) {
  const [data, setData] = useState({
    students_count: "",
    institutes_count: "",
    institutes: [],
  });
  useEffect(() => {
    const getMain = async () => {
      try {
        const response = await fetch(`${apiUrl}/main-admin`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });

        const responseData = await response.json();
        setData(responseData);
      } catch (error) {
        console.log(error.message);
      }
    };
    getMain();
  }, []);
  return (
    <section className="main">
      <div className="row pt-5 m-0" dir="rtl">
        <div
          className={
            sideBarShow
              ? "width-others-wide mr-auto main-view"
              : "width-others-narrow mr-auto main-view"
          }
          id="main-view"
        >
          <div className="row pt-md-2 pr-2 pl-2 mt-md-3 mb-5">
            <div className="col-sm-6 p-2">
              <div className="card card-common">
                <div className="card-body" dir="ltr">
                  <div className="d-flex justify-content-between">
                    <FontAwesomeIcon icon="users" color="white" size="3x" />
                    <div className="text-right text-white">
                      <h5>عدد الطلاب</h5>
                      <h3>{data.students_count}</h3>
                    </div>
                  </div>
                </div>
                <div className="card-footer text-white">
                  <i className="fas fa-sync mr-3"></i>
                  <span>تم التحديث الان</span>
                </div>
              </div>
            </div>
            <div className="col-sm-6 p-2">
              <div className="card card-common">
                <div className="card-body" dir="ltr">
                  <div className="d-flex justify-content-between">
                    <FontAwesomeIcon
                      icon="house-user"
                      color="white"
                      size="3x"
                    />
                    <div className="text-right text-white">
                      <h5>عدد المعاهد</h5>
                      <h3>{data.institutes_count}</h3>
                    </div>
                  </div>
                </div>
                <div className="card-footer text-white">
                  <i className="fas fa-sync mr-3"></i>
                  <span>تم التحديث الان</span>
                </div>
              </div>
            </div>
            {data.institutes.map((institute) => {
              return (
                <div className="col-sm-6 p-2" key={institute.id}>
                  <div className="card card-common">
                    <div className="card-body" dir="ltr">
                      <div className="d-flex justify-content-between">
                        <FontAwesomeIcon
                          icon="chart-line"
                          color="white"
                          size="3x"
                        />
                        <div className="text-right text-white">
                          <h5>عدد طلاب معهد {institute.name}</h5>
                          <h3>{institute.students_institute_count}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer text-white">
                      <i className="fas fa-sync mr-3"></i>
                      <span>تم التحديث الان</span>
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

export default MainAdmin;
