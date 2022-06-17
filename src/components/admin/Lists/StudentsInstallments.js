import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import printJS from "print-js";
import ConfirmModal from "../../common/ConfirmModal";
import Loading from "../../common/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
const apiUrl = process.env.API_URL;
var dialog = require("electron").remote.dialog;

function StudentsInstallments({ page, sideBarShow, institutes, institute }) {
  const [data, setData] = useState({
    students: [],
    installments: [],
    total_students: "",
    page: 1,
  });
  const [searchedData, setSearchedData] = useState({
    students: [],
    installments: [],
    total_students: "",
    page: 1,
  });
  const [confirmModal, setConfirmModal] = useState({
    visbile: false,
    installment_received_id: 0,
    received: 0,
    index: 0,
  });
  const [searchType, setSearchType] = useState("0");
  const [searchInstitute, setSearchInstitute] = useState("0");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getInstallments = async (page, institute_id = "0") => {
    try {
      let rr = ``;
      if (institute_id != "0") {
        rr = `${apiUrl}/student-install?page=${page}&institute_id=${institute_id}`;
        if (searchType != "0") {
          rr = `${apiUrl}/student-install?page=${page}&institute_id=${institute_id}&search=${search}`;
        }
      } else {
        if (searchType != "0") {
          rr = `${apiUrl}/student-install?page=${page}&search_type=${searchType}&search=${search}`;
        }
      }
      const response = await fetch(`${apiUrl}/student-install?page=${page}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer`,
        },
      });
      const responseData = await response.json();
      if (searchType != "0" || institute_id != "0") {
        if (page == 1) {
          setSearchedData({
            students: responseData.students,
            installments: responseData.installments,
            total_students: responseData.total_students,
            page: responseData.page,
          });
        } else {
          setSearchedData({
            students: searchedData.students.concat(responseData.students),
            installments: responseData.installments,
            total_students: responseData.total_students,
            page: responseData.page,
          });
        }
      } else {
        if (page == 1) {
          setData({
            students: responseData.students,
            installments: responseData.installments,
            total_students: responseData.total_students,
            page: responseData.page,
          });
          setSearchedData({
            students: responseData.students,
            installments: responseData.installments,
            total_students: responseData.total_students,
            page: responseData.page,
          });
        } else {
          setData({
            students: data.students.concat(responseData.students),
            installments: responseData.installments,
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
      getInstallments(1, institute);
    } else {
      getInstallments(1);
    }
  }, []);
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearchButton = (e) => {
    e.preventDefault();
    setLoading(true);
    getInstallments(1, searchInstitute);
  };

  const handleInstituteChange = (e) => {
    if (e.target.value != "0") {
      setSearchInstitute(e.target.value);
      getInstallments(1, e.target.value);
    } else {
      setSearchInstitute("0");
    }
  };
  console.log(loading);
  // const handleEditButton = (student) => {
  //   edit(student);
  // };
  const handleReceiveInstallmentsButton = async (id) => {
    let response = await dialog.showMessageBox({
      buttons: ["لا", "نعم"],
      message: "هل انت متأكد؟",
    });
    if (response.response == 1) {
      try {
        const response = await fetch(
          `${apiUrl}/student-install-bid?installment_id=${Number(id)}`,
          {
            method: "PATCH",
          }
        );

        const responseData = await response.json();
        page();
      } catch (error) {
        console.log(error.message);
        toast.warn("حصل خطأ");
      }
    }
  };
  const handleInstallmentsToggle = (studentIndex, id, received) => {
    if ((searchType != "0") | (searchInstitute != "0")) {
      const installmentIndex = searchedData.students[
        studentIndex
      ].installment_received.findIndex((i) => i.id == id);
      let nee = [...searchedData.students];
      let nee1 = [...nee[studentIndex].installment_received];
      nee1[installmentIndex] = {
        ...nee1[installmentIndex],
        received: received,
      };
      nee[studentIndex].installment_received[installmentIndex] =
        nee1[installmentIndex];
      setSearchedData({
        ...searchedData,
        students: nee,
      });
    } else if (searchType == "0") {
      const installmentIndex = data.students[
        studentIndex
      ].installment_received.findIndex((i) => i.id == id);
      let nee = [...data.students];
      let nee1 = [...nee[studentIndex].installment_received];
      nee1[installmentIndex] = {
        ...nee1[installmentIndex],
        received: received,
      };
      nee[studentIndex].installment_received[installmentIndex] =
        nee1[installmentIndex];
      setData({
        ...data,
        students: nee,
      });
    }
  };
  const handleInstallmentsToggleButton = (index, id, received) => {
    const toggleInstallment = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/student-installment?student_installment_id=${Number(
            id
          )}&receive=${received == 0 ? 1 : 0}`,
          {
            method: "PATCH",
          }
        );

        const responseData = await response.json();
      } catch (error) {
        console.log(error.message);
        handleInstallmentsToggle(index, id, received);
        toast.warn("حصل خطأ");
      }
    };
    toggleInstallment();
    handleInstallmentsToggle(index, id, received == 0 ? 1 : 0);
    toast.success("تم تغيير حالة القسط");
  };

  const printTable = () => {
    printJS({
      printable: "print-table",
      type: "html",
    });
  };

  const render_installments = (student, installment, index) => {
    const installment_received = student.installment_received.filter(
      (installment_received) =>
        installment_received.installment_id == installment.id
    )[0];
    if (installment_received) {
      if (
        installment_received.received == "1" &&
        installment.id == installment_received.installment_id
      ) {
        return (
          <td className="t-date" key={installment_received.id}>
            <FontAwesomeIcon
              icon="check-circle"
              size="2x"
              color="green"
              className="check-icon"
              // onClick={() =>
              //   setConfirmModal({
              //     ...confirmModal,
              //     visbile: true,
              //     index: index,
              //     installment_received_id: installment_received.id,
              //     received: installment_received.received,
              //   })
              // }
            />
          </td>
        );
      } else if (
        installment_received.received == "0" &&
        installment.id == installment_received.installment_id
      ) {
        return (
          <td className="t-date" key={installment_received.id}>
            <FontAwesomeIcon
              icon="times-circle"
              size="2x"
              className="times-icon"
              // onClick={() =>
              //   setConfirmModal({
              //     ...confirmModal,
              //     visbile: true,
              //     index: index,
              //     installment_received_id: installment_received.id,
              //     received: installment_received.received,
              //   })
              // }
            />
          </td>
        );
      }
    } else {
      return <td className="t-date" key={installment.id}></td>;
    }
  };

  const render_table = () => {
    if ((searchType != "0") | (searchInstitute != "0")) {
      const render_data = searchedData.students.map((student, index) => {
        return (
          <tr key={student.id} className="d-flex font-weight-bold text-white">
            <td className="t-id">{index + 1}</td>
            <td className="t-name">{student.name}</td>
            {searchedData.installments.map((installment) => {
              return render_installments(student, installment, index);
            })}
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
              <th className="t-id">&nbsp;</th>
              <th className="t-name">&nbsp;</th>
              {/* {searchedData.installments.map((installment) => {
                return (
                  <th key={installment.id} className="t-date">
                    <button
                      onClick={() =>
                        handleReceiveInstallmentsButton(installment.id)
                      }
                      className="btn btn-success text-white"
                    >
                      استلام كل الاقساط
                    </button>
                  </th>
                );
              })} */}
            </tr>
            <tr className="d-flex">
              <th className="t-id">ت</th>
              <th className="t-name">الاسم</th>
              {searchedData.installments.map((installment) => {
                return (
                  <th key={installment.id} className="t-date">
                    معهد {installment.institute_name}
                    <br />
                    القسط {installment.name}
                    <br />
                    {installment.date}
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
          <tr key={student.id} className="d-flex font-weight-bold text-white">
            <td className="t-id">{index + 1}</td>
            <td className="t-name">{student.name}</td>
            {data.installments.map((installment) => {
              return render_installments(student, installment, index);
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
          id="print-table"
        >
          <thead className="thead-dark">
            <tr className="d-flex">
              <th className="t-id">&nbsp;</th>
              <th className="t-name">&nbsp;</th>
              {/* {data.installments.map((installment) => {
                return (
                  <th key={installment.id} className="t-date">
                    <button
                      onClick={() =>
                        handleReceiveInstallmentsButton(installment.id)
                      }
                      className="btn btn-success text-white"
                    >
                      استلام كل الاقساط
                    </button>
                  </th>
                );
              })} */}
            </tr>
            <tr className="d-flex">
              <th className="t-id">ت</th>
              <th className="t-name">الاسم</th>
              {data.installments.map((installment) => {
                return (
                  <th key={installment.id} className="t-date">
                    معهد {installment.institute_name}
                    <br />
                    القسط {installment.name}
                    <br />
                    {installment.date}
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
                  <form>
                    <div className="form-group row mt-1">
                      <div className="col-2 text">
                        <button
                          type="submit"
                          className="btn btn-secondary btn-sm mt-1"
                          onClick={handleSearchButton}
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
                    filename="الاقساط"
                    sheet="الاقساط"
                    buttonText="طباعة"
                  />
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
                  <h2 className="text text-white">اقساط الطلاب</h2>
                </div>
              </div>
            </div>
            <ConfirmModal
              show={confirmModal.visbile}
              onHide={() =>
                setConfirmModal({ ...confirmModal, visbile: false })
              }
              handleToggleButton={handleInstallmentsToggleButton}
              index={confirmModal.index}
              student_id={confirmModal.installment_received_id}
              done={confirmModal.received}
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
                    getInstallments(
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

export default StudentsInstallments;
