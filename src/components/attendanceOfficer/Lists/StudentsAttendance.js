import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import printJS from "print-js";
const apiUrl = process.env.API_URL;

function StudentsAttendance({
  sideBarShow,
  data,
  setData,
  searchedData,
  setSearchedData,
  institutes,
  institute,
}) {
  const [searchType, setSearchType] = useState("0");
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  const [searchInstitute, setSearchInstitute] = useState("0");
  useEffect(() => {
    setSearchInstitute(institute);
    if (institute != "0") {
      setSearchedData({
        students: [...data.students].filter((d) => d.institute_id == institute),
        attendance: [...data.attendance].filter(
          (d) => d.institute_id == institute
        ),
      });
    }
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
  // const handleSearchInstituteChange = (e) => {
  //   setSearchInstitute(e);
  // };
  console.log(searchedData);
  const handleSearchButton = (e) => {
    e.preventDefault();
    const reg = new RegExp(search, "i");
    if (searchInstitute != "0") {
      if (searchType == "1") {
        setSearchedData({
          students: [...data.students].filter(
            (d) => d.name.match(reg) && d.institute_id == searchInstitute
          ),
          attendance: [...data.attendance].filter(
            (d) => d.institute_id == searchInstitute
          ),
        });
      } else if (searchType == "2") {
        setSearchedData({
          students: [...data.students].filter(
            (d) => d.institute_id == searchInstitute
          ),
          attendance: [...data.attendance].filter(
            (d) =>
              d.date <= search2 &&
              d.date >= search &&
              d.institute_id == searchInstitute
          ),
        });
      }
    } else {
      if (searchType == "1") {
        setSearchedData({
          students: [...data.students].filter((d) => d.name.match(reg)),
          attendance: [...data.attendance],
        });
      } else if (searchType == "2") {
        setSearchedData({
          attendance: [...data.attendance].filter(
            (d) => d.date <= search2 && d.date >= search
          ),
          students: [...data.students],
        });
      }
    }
  };
  const handleInstituteChange = (e) => {
    if (e.target.value != "0") {
      setSearchInstitute(e.target.value);
      setSearchedData({
        students: [...data.students].filter(
          (d) => d.institute_id == e.target.value
        ),
        attendance: [...data.attendance].filter(
          (d) => d.institute_id == e.target.value
        ),
      });
    } else {
      setSearchInstitute("0");
      setSearchedData({
        students: [...data.students],
        attendance: [...data.attendance],
      });
    }
  };
  // const handleEditButton = (student) => {
  //   edit(student);
  // };
  const handleAttendanceToggle = (studentIndex, id, attended) => {
    if ((searchType != "0") | (searchInstitute != "0")) {
      const attendanceIndex = searchedData.students[
        studentIndex
      ].student_attendance.findIndex((i) => i.student_attendance_id == id);
      let nee = [...searchedData.students];
      let nee1 = [...nee[studentIndex].student_attendance];
      nee1[attendanceIndex] = {
        ...nee1[attendanceIndex],
        attended: attended,
      };
      nee[studentIndex].student_attendance[attendanceIndex] =
        nee1[attendanceIndex];
      setSearchedData({
        ...searchedData,
        students: nee,
      });
    } else if (searchType == "0") {
      const attendanceIndex = data.students[
        studentIndex
      ].student_attendance.findIndex((i) => i.student_attendance_id == id);
      let nee = [...data.students];
      let nee1 = [...nee[studentIndex].student_attendance];
      nee1[attendanceIndex] = {
        ...nee1[attendanceIndex],
        attended: attended,
      };
      nee[studentIndex].student_attendance[attendanceIndex] =
        nee1[attendanceIndex];
      setData({
        ...data,
        students: nee,
      });
    }
  };
  const handleAttendanceToggleButton = (index, id, attended) => {
    const toggleAttendance = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/students-attendance?student_attendance_id=${Number(
            id
          )}&attended=${attended == 0 ? 1 : 0}`,
          {
            method: "PATCH",
          }
        );

        const responseData = await response.json();
      } catch (error) {
        console.log(error.message);
        handleAttendanceToggle(index, id, attended);
        toast.warn("حصل خطأ");
      }
    };
    let box = confirm("هل انت متأكد؟");
    if (box) {
      toggleAttendance();
      handleAttendanceToggle(index, id, attended == 0 ? 1 : 0);
      toast.success("تم تغيير حالة الحضور");
    }
  };
  const printTable = () => {
    // let divToPrint = document.getElementById("print-table");
    // newWin = window.open("");
    // newWin.document.write(divToPrint.outerHTML);
    // newWin.print();
    // newWin.close();
    printJS({
      printable: "print-table",
      type: "html",
    });
    // window.print();
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
            id="searchStudent"
            onChange={handleSearchChange}
            placeholder="ابحث"
          ></input>
        </div>
      );
    } else if (searchType == "2") {
      return (
        <Fragment>
          <div className="col-5 offset-2 col-md-3 offset-md-0 order-0 order-md-2">
            <input
              type="date"
              className="form-control text"
              id="searchDate"
              onChange={handleSearchChange}
            ></input>
          </div>
          <p
            className="col-2 col-md-1 order-1 order-md-3 text-white"
            style={{ fontSize: "20px" }}
          >
            من
          </p>
          <div className="col-5 offset-5 col-md-3 offset-md-0 order-2 order-md-0">
            <input
              type="date"
              className="form-control text"
              id="searchDate"
              onChange={handleSearch2Change}
            ></input>
          </div>
          <p
            className="col-2 col-md-1 order-3 order-md-1 text-white"
            style={{ fontSize: "20px" }}
          >
            الى
          </p>
        </Fragment>
      );
    }
  };
  const renderAttendance = (student, attendance, index) => {
    const student_attendance = student.student_attendance.filter(
      (student_attendance) => student_attendance.attendance_id == attendance.id
    )[0];
    console.log(student_attendance);
    if (student_attendance) {
      if (
        student_attendance.attended == "1" &&
        attendance.id == student_attendance.attendance_id
      ) {
        return (
          <td className="t-date" key={student_attendance.student_attendance_id}>
            <FontAwesomeIcon
              icon="check-circle"
              size="2x"
              color="green"
              className="check-icon"
              onClick={() =>
                handleAttendanceToggleButton(
                  index,
                  student_attendance.student_attendance_id,
                  student_attendance.attended
                )
              }
            />
          </td>
        );
      } else if (
        student_attendance.attended == "0" &&
        attendance.id == student_attendance.attendance_id
      ) {
        return (
          <td className="t-date" key={student_attendance.student_attendance_id}>
            <FontAwesomeIcon
              icon="times-circle"
              size="2x"
              className="times-icon"
              onClick={() =>
                handleAttendanceToggleButton(
                  index,
                  student_attendance.student_attendance_id,
                  student_attendance.attended
                )
              }
            />
          </td>
        );
      }
    } else {
      return <td key={attendance.id} className="t-date"></td>;
    }
  };
  const render_table = () => {
    if ((searchType != "0") | (searchInstitute != "0")) {
      const render_data = searchedData.students.map((student, index) => {
        return (
          <tr key={student.id} className="font-weight-bold text-white">
            <td className="t-id">{index + 1}</td>
            <td className="t-name">{student.name}</td>
            {searchedData.attendance.map((attendance) => {
              return renderAttendance(student, attendance, index);
            })}
            {/* <td>
            <button
              onClick={() => handleEditButton(student)}
              className="btn btn-secondary text-white"
            >
              تعديل
            </button>
          </td> */}
          </tr>
        );
      });
      return (
        <table
          className="table table-dark table-striped table-bordered table-hover text"
          dir="rtl"
          border="1"
        >
          <thead className="thead-dark">
            <tr>
              <th className="t-id">ت</th>
              <th className="t-name">الاسم</th>
              {searchedData.attendance.map((attendance) => {
                return (
                  <th key={attendance.id} className="t-date">
                    {attendance.date}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{render_data}</tbody>
        </table>
      );
    } else if (searchType == "0") {
      const render_data = data.students.map((student, index) => {
        return (
          <tr
            key={student.id}
            className="font-weight-bold text-white"
            className="d-flex"
          >
            <td className="t-id">{index + 1}</td>
            <td className="t-name">{student.name}</td>
            {data.attendance.map((attendance) => {
              return renderAttendance(student, attendance, index);
            })}
            {/* <td>
              <button
                onClick={() => handleEditButton(student)}
                className="btn btn-secondary text-white"
              >
                تعديل
              </button>
            </td> */}
          </tr>
        );
      });
      return (
        <table
          className="table table-dark table-striped table-bordered table-hover text"
          dir="rtl"
          border="1"
        >
          <thead className="thead-dark">
            <tr className="d-flex">
              <th className="t-id">ت</th>
              <th className="t-name">الاسم</th>
              {data.attendance.map((attendance) => {
                return (
                  <th key={attendance.id} className="t-date">
                    {attendance.date}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{render_data}</tbody>
        </table>
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
                <div className="col-8">
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
                          <option value="2">التاريخ</option>
                        </select>
                      </div>
                      {searchBar()}
                    </div>
                  </form>
                </div>
                <div className="col-1 pt-1">
                  <button onClick={printTable} className="btn btn-light">
                    طباعة
                  </button>
                </div>
                <div className="col-1 pt-1">
                  <select
                    id="institute"
                    onChange={handleInstituteChange}
                    className="form-control"
                    dir="rtl"
                    value={searchInstitute}
                  >
                    <option value="0" defaultValue>
                      المعهد
                    </option>
                    {institutes.map((institute) => (
                      <option key={institute.id} value={institute.id}>
                        {institute.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-2">
                  <h2 className="text text-white">حضور الطلاب</h2>
                </div>
              </div>
            </div>
            <div className="col-12" id="print-table">
              <div className="table-responsive">{render_table()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentsAttendance;
