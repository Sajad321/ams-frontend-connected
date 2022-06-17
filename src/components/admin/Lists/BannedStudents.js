import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import printJS from "print-js";
import ConfirmModal from "../../common/ConfirmModal";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../../common/Loading";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
const apiUrl = process.env.API_URL;

// var { ipcRenderer } = require("electron");

function StudentsAttendance({ sideBarShow, institutes, institute }) {
  const [data, setData] = useState({
    students: [],
    attendance: [],
    total_students: "",
    page: 1,
  });
  const [searchedData, setSearchedData] = useState({
    students: [],
    attendance: [],
    total_students: "",
    page: 1,
  });
  const [confirmModal, setConfirmModal] = useState({
    visbile: false,
    index: 0,
    student_attendance_id: 0,
    attended: 0,
  });
  const [searchType, setSearchType] = useState("0");
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [searchInstitute, setSearchInstitute] = useState("0");
  const [slicing, setSlice] = useState(5);
  const [loading, setLoading] = useState(true);

  const getAttendance = async (page, institute_id = "0") => {
    try {
      let rr = ``;
      if (institute_id != "0") {
        rr = `${apiUrl}/banned-students-attendance?page=${page}&institute_id=${institute_id}`;
        if (searchType != "0") {
          rr = `${apiUrl}/banned-students-attendance?page=${page}&institute_id=${institute_id}&search_type=${searchType}&search1=${search1}&search2=${search2}`;
        }
      } else {
        if (searchType != "0") {
          rr = `${apiUrl}/banned-students-attendance?page=${page}&search_type=${searchType}&search1=${search1}&search2=${search2}`;
        }
      }
      const response = await fetch(
        rr != `` ? rr : `${apiUrl}/banned-students-attendance?page=${page}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        }
      );
      const responseData = await response.json();
      if (searchType != "0" || institute_id != "0") {
        if (page == 1) {
          setSearchedData({
            students: responseData.students,
            attendance: responseData.attendance,
            total_students: responseData.total_students,
            page: responseData.page,
          });
        } else {
          setSearchedData({
            students: searchedData.students.concat(responseData.students),
            attendance: responseData.attendance,
            total_students: responseData.total_students,
            page: responseData.page,
          });
        }
      } else {
        if (page == 1) {
          setData({
            students: responseData.students,
            attendance: responseData.attendance,
            total_students: responseData.total_students,
            page: responseData.page,
          });
          setSearchedData({
            students: responseData.students,
            attendance: responseData.attendance,
            total_students: responseData.total_students,
            page: responseData.page,
          });
        } else {
          setData({
            students: data.students.concat(responseData.students),
            attendance: responseData.attendance,
            total_students: responseData.total_students,
            page: responseData.page,
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    setSearchInstitute(institute);
    if (institute != "0") {
      getAttendance(1, institute);
    } else {
      getAttendance(1);
    }
  }, []);
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  const handleSearch1Change = (e) => {
    setSearch1(e.target.value);
  };
  const handleSearch2Change = (e) => {
    setSearch2(e.target.value);
  };
  const handleInstituteChange = (e) => {
    if (e.target.value != "0") {
      setSearchInstitute(e.target.value);
      getAttendance(1, e.target.value);
    } else {
      setSearchInstitute("0");
    }
  };
  const handleAllAttendanceButton = () => {
    if (slicing == 5) {
      if ((searchType != "0") | (searchInstitute != "0")) {
        setSlice(searchedData.attendance.length);
      } else {
        setSlice(data.attendance.length);
      }
    } else {
      setSlice(5);
    }
  };

  const handleSearchButton = (e) => {
    e.preventDefault();
    setLoading(true);
    getAttendance(1, searchInstitute);
  };

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
          )}&attended=${attended == 0 ? 1 : 0}&time=${new Date().toLocaleString(
            "ar-SA",
            {
              hour: "numeric",
              hour12: true,
              minute: "numeric",
            }
          )}`,
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
    // let res = dialog.showMessageBox({
    //   buttons: ["نعم", "لا"],
    //   message: "هل انت متأكد؟",
    // });
    // console.log(res);
    // let box = confirm("هل انت متأكد؟");
    // if (box) {
    toggleAttendance();
    handleAttendanceToggle(index, id, attended == 0 ? 1 : 0);
    toast.success("تم تغيير حالة الحضور");
    // }
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
            onChange={handleSearch1Change}
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
              onChange={handleSearch1Change}
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
    } else if (searchType == "3") {
      return (
        <Fragment>
          <div className="col-5 offset-2 col-md-3 offset-md-0 order-0 order-md-2">
            <input
              type="time"
              className="form-control text"
              id="searchDate"
              onChange={handleSearch1Change}
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
              type="time"
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
              onClick={() => {
                // handleAttendanceToggleButton(
                //   index,
                //   student_attendance.student_attendance_id,
                //   student_attendance.attended
                // )

                setConfirmModal({
                  ...confirmModal,
                  visbile: true,
                  index: index,
                  student_attendance_id:
                    student_attendance.student_attendance_id,
                  attended: student_attendance.attended,
                });
              }}
            />
            <span>{student_attendance.time}</span>
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
              onClick={() => {
                // handleAttendanceToggleButton(
                //   index,
                //   student_attendance.student_attendance_id,
                //   student_attendance.attended
                // );
                setConfirmModal({
                  ...confirmModal,
                  visbile: true,
                  index: index,
                  student_attendance_id:
                    student_attendance.student_attendance_id,
                  attended: student_attendance.attended,
                });
              }}
            />
          </td>
        );
      }
    } else {
      return <td className="t-date"></td>;
    }
  };
  const handleBanningToggle = (studentIndex, banned) => {
    if ((searchType != "0") | (searchInstitute != "0")) {
      let neeSerached = searchedData.students;
      neeSerached[studentIndex].banned = banned;
      setSearchedData({ ...searchedData, students: neeSerached });
    } else if (searchType == "0") {
      let nee = data.students;
      nee[studentIndex].banned = banned;
      setData({ ...data, students: nee });
    }
  };
  const handleStudentDismiss = async (index, id) => {
    try {
      const response = await fetch(
        `${apiUrl}/banned?student_id=${Number(id)}&ban=${1}`,
        {
          method: "PATCH",
        }
      );

      const responseData = await response.json();
    } catch (error) {
      console.log(error.message);
      toast.warn("حصل خطأ");
    }
    handleBanningToggle(index, 1);
    toast.success("تم فصل الطالب");
  };
  const handleStudentReturn = async (index, id) => {
    try {
      const response = await fetch(
        `${apiUrl}/banned?student_id=${Number(id)}&ban=${0}`,
        {
          method: "PATCH",
        }
      );

      const responseData = await response.json();
    } catch (error) {
      console.log(error.message);
      toast.warn("حصل خطأ");
    }
    handleBanningToggle(index, 0);
    toast.success("تم ارجاع الطالب");
  };
  const render_table = () => {
    if (searchType != "0" || searchInstitute != "0") {
      const render_data = searchedData.students.map((student, index) => {
        return (
          <tr key={student.id} className="font-weight-bold text-white d-flex">
            <td className="t-id">{index + 1}</td>
            <td className={`t-name ${student.banned == 1 ? `bg-danger` : ``}`}>
              {student.name}
            </td>
            {searchedData.attendance.slice(0, slicing).map((attendance) => {
              return renderAttendance(student, attendance, index);
            })}
            {/* <td className="">
              {student.banned == 1 ? (
                <button
                  onClick={() => handleStudentReturn(index, student.id)}
                  className="btn btn-success text-white"
                >
                  ارجاع
                </button>
              ) : (
                <button
                  onClick={() => handleStudentDismiss(index, student.id)}
                  className="btn btn-info text-white"
                >
                  فصل
                </button>
              )}
            </td> */}
          </tr>
        );
      });
      return (
        <table
          className="table table-dark table-striped table-bordered table-hover text"
          dir="rtl"
          border="1"
          id="print-table"
        >
          <thead className="thead-dark">
            <tr className="d-flex">
              <th className="t-id">ت</th>
              <th className="t-name">الاسم</th>
              {searchedData.attendance.slice(0, slicing).map((attendance) => {
                return (
                  <th key={attendance.id} className="t-date">
                    {attendance.date}
                  </th>
                );
              })}
              {/* <th className="">&nbsp;</th> */}
            </tr>
          </thead>
          <tbody>{render_data}</tbody>
        </table>
      );
    } else {
      const render_data = data.students.map((student, index) => {
        return (
          <tr key={student.id} className="font-weight-bold text-white d-flex">
            <td className="t-id">{index + 1}</td>
            <td className={`t-name ${student.banned == 1 ? `bg-danger` : ``}`}>
              {student.name}
            </td>
            {data.attendance.slice(0, slicing).map((attendance) => {
              return renderAttendance(student, attendance, index);
            })}
            {/* <td className="">
              {student.banned == 1 ? (
                <button
                  onClick={() => handleStudentReturn(index, student.id)}
                  className="btn btn-success text-white"
                >
                  ارجاع
                </button>
              ) : (
                <button
                  onClick={() => handleStudentDismiss(index, student.id)}
                  className="btn btn-info text-white"
                >
                  فصل
                </button>
              )}
            </td> */}
          </tr>
        );
      });
      return (
        <table
          className="table table-dark table-striped table-bordered table-hover text"
          dir="rtl"
          border="1"
          id="print-table"
        >
          <thead className="thead-dark">
            <tr className="d-flex">
              <th className="t-id">ت</th>
              <th className="t-name">الاسم</th>
              {data.attendance.slice(0, slicing).map((attendance) => {
                return (
                  <th key={attendance.id} className="t-date">
                    {attendance.date}
                  </th>
                );
              })}
              {/* <th className="">&nbsp;</th> */}
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
                <div className="col-7">
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
                          <option value="3">الوقت</option>
                        </select>
                      </div>
                      {searchBar()}
                    </div>
                  </form>
                </div>
                <div className="col-1 pt-1">
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="btn btn-light"
                    table="print-table"
                    filename="الحضور"
                    sheet="الحضور"
                    buttonText="طباعة"
                  />
                </div>
                <div className="col-1 pt-1">
                  <button
                    onClick={handleAllAttendanceButton}
                    className="btn btn-secondary"
                  >
                    كل الايام
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
            <ConfirmModal
              show={confirmModal.visbile}
              onHide={() =>
                setConfirmModal({ ...confirmModal, visbile: false })
              }
              handleToggleButton={handleAttendanceToggleButton}
              index={confirmModal.index}
              student_id={confirmModal.student_attendance_id}
              done={confirmModal.attended}
            />
            <div className="col-12">
              {loading ? (
                <Loading />
              ) : (
                <InfiniteScroll
                  dataLength={
                    searchType != "0" || searchInstitute != "0"
                      ? searchedData.page * 100
                      : data.page * 100
                  } //This is important field to render the next data
                  next={() =>
                    getAttendance(
                      searchType != "0" || searchInstitute != "0"
                        ? searchedData.page + 1
                        : data.page + 1,
                      searchType != "0" || searchInstitute != "0"
                        ? searchInstitute
                        : "0"
                    )
                  }
                  hasMore={
                    searchType != "0" || searchInstitute != "0"
                      ? searchedData.total_students !=
                        searchedData.students.length
                      : data.total_students != data.students.length
                  }
                  loader={<Loading />}
                  endMessage={
                    <p className="pb-3 pt-3 text-center text-white">
                      <b>هذه جميع النتائج</b>
                    </p>
                  }
                  // below props only if you need pull down functionality
                  // refreshFunction={this.refresh}
                  // pullDownToRefresh
                  // pullDownToRefreshThreshold={50}
                  // pullDownToRefreshContent={
                  //   <h3 style={{ textAlign: "center" }}>
                  //     &#8595; Pull down to refresh
                  //   </h3>
                  // }
                  // releaseToRefreshContent={
                  //   <h3 style={{ textAlign: "center" }}>
                  //     &#8593; Release to refresh
                  //   </h3>
                  // }
                >
                  <div className="table-responsive">{render_table()}</div>
                </InfiniteScroll>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentsAttendance;
