import React, { useState, useEffect, Fragment } from "react";
const apiUrl = process.env.API_URL;

function StudentsInstallments({ edit, sideBarShow }) {
  const [doctors, setDoctors] = useState([]);
  const [searchType, setSearchType] = useState("0");
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const [searchedDoctors, setSearchedDoctors] = useState([...doctors]);
  useEffect(() => {
    const getDoctors = async () => {
      try {
        const response = await fetch(`${apiUrl}/doctors-detail`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });

        const responseData = await response.json();
        setDoctors(responseData.doctors);
        setSearchedDoctors(responseData.doctors);
      } catch (error) {
        console.log(error.message);
      }
    };
    getDoctors();
  }, []);
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearch2Change = (e) => {
    setSearch2(e.target.value);
  };
  const handleSearchButton = (e) => {
    e.preventDefault();
    const reg = new RegExp(search, "i");
    if (searchType == "1") {
      setSearchedDoctors(
        [...doctors].filter(
          (d) => d.date_of_joining <= search2 && d.date_of_joining >= search
        )
      );
    } else if (searchType == "2") {
      setSearchedDoctors([...doctors].filter((d) => d.name.match(reg)));
    } else if (searchType == "3") {
      setSearchedDoctors([...doctors].filter((d) => d.zone.match(reg)));
    } else if (searchType == "4") {
      setSearchedDoctors([...doctors].filter((d) => d.speciality.match(reg)));
    }
  };
  const handleEditButton = (doctor) => {
    edit(doctor);
  };
  const render_report_activity = (report_activity) => {
    if (report_activity == true) {
      return <td className="bg-success d-block mt-3"></td>;
    } else if (report_activity == false) {
      return <td className="bg-danger d-block mt-3"></td>;
    } else {
      return <td className="d-block mt-3"></td>;
    }
  };
  const render_table = () => {
    if (searchType == "0") {
      const render_doctors = doctors.map((doctor) => {
        return (
          <tr key={doctor.id} className="font-weight-bold">
            <td>{doctor.name}</td>
            <td>
              {doctor.pharmacies.map((pharmacy) => {
                if (doctor.pharmacies.length == 1) {
                  return `${pharmacy.name}`;
                } else {
                  return `${pharmacy.name}, `;
                }
              })}
            </td>
            {render_report_activity(doctor.report_activity)}
            <td>
              <button
                onClick={() => handleEditButton(doctor)}
                className="btn btn-secondary text-white"
              >
                تعديل
              </button>
            </td>
          </tr>
        );
      });
      return (
        <table
          className="table table-striped table-bordered table-hover text"
          dir="rtl"
        >
          <thead className="thead-dark">
            <tr>
              <th>الاسم</th>
              {searchedDoctors.map((doctor) => {
                return (
                  <th key={doctor.id}>
                    {doctor.name}
                    <br />
                    {doctor.date}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{render_doctors}</tbody>
        </table>
      );
    } else {
      const render_doctors = searchedDoctors.map((doctor) => {
        return (
          <tr key={doctor.id} className="font-weight-bold">
            <td>{doctor.name}</td>
            <td>
              {doctor.pharmacies.map((pharmacy) => {
                if (doctor.pharmacies.length == 1) {
                  return `${pharmacy.name}`;
                } else {
                  return `${pharmacy.name}, `;
                }
              })}
            </td>
            {render_report_activity(doctor.report_activity)}
            <td>
              <button
                onClick={() => handleEditButton(doctor)}
                className="btn btn-secondary text-white"
              >
                تعديل
              </button>
            </td>
          </tr>
        );
      });
      return (
        <table
          className="table table-striped table-bordered table-hover text"
          dir="rtl"
        >
          <thead className="thead-dark">
            <tr>
              <th>الاسم</th>
              {searchedDoctors.map((doctor) => {
                return (
                  <th key={doctor.id}>
                    {doctor.name}
                    <br />
                    {doctor.date}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{render_doctors}</tbody>
        </table>
      );
    }
  };
  const searchBar = () => {
    if (searchType == "0") {
      return (
        <div className="col-7">
          <p className="form-control text">بحث حسب </p>
        </div>
      );
    } else if (searchType == "1") {
      return (
        <div className="col-7">
          <input
            type="text"
            className="form-control text"
            id="searchDoctor"
            onChange={handleSearchChange}
            placeholder="ابحث"
          ></input>
        </div>
      );
    } else if (searchType == "2") {
      return (
        <div className="col-7">
          <input
            type="text"
            className="form-control text"
            id="searchZone"
            onChange={handleSearchChange}
            placeholder="ابحث"
          ></input>
        </div>
      );
    }
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
          <div className="row pt-md-3 pr-2 pl-2 mt-md-3 mb-5">
            <div className="col-12">
              <div className="row mt-3">
                <div className="col-12 col-md-8 order-last order-md-first">
                  <form onSubmit={handleSearchButton}>
                    <div className="form-group row mt-1">
                      <div className="col-2 text">
                        <button
                          type="submit"
                          className="btn btn-secondary btn-sm mt-1"
                        >
                          ابحث
                        </button>
                      </div>
                      <div className="col-3 col-sm-2">
                        <select
                          id="searchType"
                          onChange={handleSearchTypeChange}
                          className="form-control"
                          dir="rtl"
                        >
                          <option value="0" defaultValue>
                            الكل
                          </option>
                          <option value="1">الاسم</option>
                          <option value="2">المعهد</option>
                        </select>
                      </div>
                      {searchBar()}
                    </div>
                  </form>
                </div>
                <div className="col-12 col-md-4 order-first order-md-last">
                  <h2 className="text text-white">اقساط الطلاب</h2>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="table-responsive">{render_table()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentsInstallments;
