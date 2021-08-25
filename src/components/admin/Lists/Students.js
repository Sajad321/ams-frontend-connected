import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StudentsInfoModal } from "../../common/Modal";
const apiUrl = process.env.API_URL;

function Salesmen({ sideBarShow }) {
  const [students, setStudents] = useState([]);
  const [searchType, setSearchType] = useState("0");
  const [search, setSearch] = useState("");
  const [searchedStudents, setSearchedStudents] = useState([...students]);
  const [studentsInfoModal, setStudentsInfoModal] = useState({
    visible: false,
    id: "",
    name: "",
    institute: "",
    batch_num: "",
    phone: "",
    dob: "",
    student: {},
  });
  const [qr, setQr] = useState({});
  const [photo, setPhoto] = useState({});
  const getQr = async (student_id) => {
    try {
      const response = await fetch(`${apiUrl}/qr?student_id=${student_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responseQr = await response.blob();
      setQr(new Blob([responseQr], { type: "image/png" }));
    } catch (error) {
      console.log(error.message);
    }
  };
  const getPhoto = async (student_id) => {
    try {
      const response = await fetch(`${apiUrl}/photo?student_id=${student_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });

      const responsePhoto = await response.blob();
      setPhoto(new Blob([responsePhoto], { type: "image/jpeg" }));
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const getStudents = async () => {
      try {
        const response = await fetch(`${apiUrl}/students`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });

        const responseData = await response.json();
        setStudents(responseData);
        setSearchedStudents(responseData);
      } catch (error) {
        console.log(error.message);
      }
    };
    getStudents();
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
    // setLoading(true);
    const reg = new RegExp(search, "i");
    if (searchType == "1") {
      setSearchedStudents([...students].filter((d) => d.name.match(reg)));
    } else if (searchType == "2") {
      setSearchedStudents([...students].filter((d) => d.institute.match(reg)));
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
            id="searchStudent"
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
            id="searchInstitute"
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
          <div className="row pt-md-2 pr-2 pl-2 mt-md-3 mb-5">
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
                          <option value="2">المعهد</option>
                        </select>
                      </div>
                      {searchBar()}
                    </div>
                  </form>
                </div>
                <div className="col-1 offset-1 pt-1">
                  <select
                    id="searchType"
                    onChange={handleSearchTypeChange}
                    className="form-control"
                    dir="rtl"
                  >
                    <option value="0" defaultValue>
                      الدفعة
                    </option>
                    <option value="1">الاسم</option>
                    <option value="2">المعهد</option>
                  </select>
                </div>
                <div className="col-2">
                  <h2 className="text text-white">معلومات الطلاب</h2>
                </div>
              </div>
            </div>

            <StudentsInfoModal
              show={studentsInfoModal.visible}
              onHide={() =>
                setStudentsInfoModal({ ...studentsInfoModal, visible: false })
              }
              id={studentsInfoModal.id}
              name={studentsInfoModal.name}
              institute={studentsInfoModal.institute}
              batch_num={studentsInfoModal.batch_num}
              phone={studentsInfoModal.phone}
              dob={studentsInfoModal.dob}
              student={studentsInfoModal.student}
              qr={qr}
              photo={photo}
            />
            <div className="col-12" dir="rtl">
              <div className="row">
                {searchType == "0"
                  ? students.map((student) => {
                      return (
                        <div
                          className="col-3 p-2 m-0"
                          key={student.id}
                          dir="ltr"
                        >
                          <div
                            className="card card-common card-height"
                            onClick={() => {
                              getQr(student.id);
                              getPhoto(student.id);
                              setStudentsInfoModal({
                                ...studentsInfoModal,
                                visible: true,
                                id: student.id,
                                name: student.name,
                                institute: student.institute,
                                batch_num: student.batch_num,
                                phone: student.phone,
                                dob: student.dob,
                                student: student,
                              });
                            }}
                          >
                            <div className="card-body pb-2 pt-3 pr-3 pl-3">
                              <div className="row d-flex align-content-center justify-content-center">
                                <div className="col-12 text-right text-white">
                                  <p className="mb-0">الاسم: {student.name}</p>
                                  <p className="mb-0">
                                    المعهد: {student.institute}
                                  </p>
                                  <p className="mb-0">
                                    الدفعة: {student.batch_num}
                                  </p>
                                  <p className="mb-0">
                                    رقم الهاتف: {student.phone}
                                  </p>
                                  <p className="mb-0">
                                    المواليد: {student.dob}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleEditButton(student)}
                                  className="btn btn-secondary text-white mt-2"
                                >
                                  تعديل
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : searchedStudents.map((student) => {
                      return (
                        <div
                          className="col-3 p-2 m-0"
                          key={student.id}
                          dir="ltr"
                        >
                          <div
                            className="card card-common card-height"
                            onClick={() => {
                              getQr(student.id);
                              getPhoto(student.id);
                              setStudentsInfoModal({
                                ...studentsInfoModal,
                                visible: true,
                                id: student.id,
                                name: student.name,
                                institute: student.institute,
                                batch_num: student.batch_num,
                                phone: student.phone,
                                dob: student.dob,
                                student: student,
                              });
                            }}
                          >
                            <div className="card-body pb-2 pt-3 pr-3 pl-3">
                              <div className="row d-flex align-content-center justify-content-center">
                                <div className="col-12 text-right text-white">
                                  <p className="mb-0">الاسم: {student.name}</p>
                                  <p className="mb-0">
                                    المعهد: {student.institute}
                                  </p>
                                  <p className="mb-0">
                                    الدفعة: {student.batch_num}
                                  </p>
                                  <p className="mb-0">
                                    رقم الهاتف: {student.phone}
                                  </p>
                                  <p className="mb-0">
                                    المواليد: {student.dob}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleEditButton(student)}
                                  className="btn btn-secondary text-white mt-2"
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
        </div>
      </div>
    </section>
  );
}

export default Salesmen;
