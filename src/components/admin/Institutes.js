import React, { useState, useEffect, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InstitutesModal } from "../common/Modal.js";
const apiUrl = process.env.API_URL;

function Institutes({ edit, sideBarShow }) {
  const [institutes, setInstitutes] = useState([]);
  const [searchType, setSearchType] = useState("0");
  const [search, setSearch] = useState("");
  const [searchedInstitutes, setSearchedInstitutes] = useState([...institutes]);
  useEffect(() => {
    const getInstitutes = async () => {
      try {
        const response = await fetch(`${apiUrl}/institutes`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });

        const responseData = await response.json();
        setInstitutes(responseData.institutes);
        setSearchedInstitutes(responseData.institutes);
      } catch (error) {
        console.log(error.message);
      }
    };
    getInstitutes();
  }, []);
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearchButton = (e) => {
    e.preventDefault();
    const reg = new RegExp(search, "i");
    if (searchType == "1") {
      setSearchedInstitutes([...institutes].filter((d) => d.name.match(reg)));
    }
  };

  const handleInsitute = () => {
    if (confirm("هل تود البدء بتسجيل الحضور")) {
      console.log("yes");
    }
  };

  const searchBar = () => {
    if (searchType == "0") {
      return (
        <div className="col-7">
          <p className="form-control text m-0">بحث حسب </p>
        </div>
      );
    } else if (searchType == "1") {
      return (
        <div className="col-7">
          <input
            type="text"
            className="form-control text"
            id="searchCompany"
            onChange={handleSearchChange}
            placeholder="ابحث"
          ></input>
        </div>
      );
    }
  };
  const handleEditButton = (institute) => {
    edit(institute);
  };
  const [modalShow, setModalShow] = useState(false);
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
                        </select>
                      </div>
                      {searchBar()}
                    </div>
                  </form>
                </div>
                <div className="col-12 col-md-4 order-first order-md-last">
                  <h2 className="text text-white">المعاهد</h2>
                </div>
              </div>
            </div>
            <div className="col-sm-3 p-2" dir="ltr">
              <InstitutesModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
              <div
                className="card card-common card-height"
                onClick={() => setModalShow(true)}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-10 col-sm-9 text-right text-white">
                      <h5>البنوك</h5>
                    </div>
                    <div className="col-2 col-sm-3 p-0 text-center text-white">
                      <FontAwesomeIcon icon="users" size="3x" />
                    </div>
                    <button
                      onClick={() => handleEditButton()}
                      className="btn btn-secondary text-white"
                    >
                      تعديل
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {searchType == "0"
              ? institutes.map((institute) => {
                  return (
                    <div className="col-sm-3 p-2" key={institute.id}>
                      <div
                        className="card card-common card-height"
                        onClick={handleInsitute}
                      >
                        <div className="card-body">
                          <div className="row">
                            <div className="col-10 col-sm-9 text-right text-secondary">
                              <h5>{institute.name}</h5>
                            </div>
                            <div className="col-2 col-sm-3 p-0 text-center text-secondary">
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
                })
              : searchedInstitutes.map((institute) => {
                  return (
                    <div className="col-sm-3 p-2" key={institute.id}>
                      <div className="card card-common card-height">
                        <div className="card-body">
                          <div className="row">
                            <div className="col-10 col-sm-9 text-right text-secondary">
                              <h5>{institute.name}</h5>
                            </div>
                            <div className="col-2 col-sm-3 p-0 text-center text-secondary">
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
