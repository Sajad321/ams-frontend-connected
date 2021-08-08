import React, { useState, useEffect, Fragment } from "react";
const apiUrl = process.env.API_URL;

function StudentAttendance() {
  const [loading, setLoading] = useState(true);
  const [salesmen, setSalesmen] = useState([]);
  const [search, setSearch] = useState("");
  const [search2, setSearch2] = useState("");
  useEffect(() => {
    const getSalesmen = async () => {
      try {
        const response = await fetch(`${apiUrl}/salesmen-detail`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });

        const responseData = await response.json();
        setSalesmen(responseData.salesmen);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
        setLoading(false);
      }
    };
    getSalesmen();
  }, []);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearch2Change = (e) => {
    setSearch2(e.target.value);
  };
  const handleSearchButton = (e) => {
    e.preventDefault();
    setLoading(true);
    if (search2 != "") {
      const searchFetch = async () => {
        try {
          const response = await fetch(
            `${apiUrl}/salesmen-detail?from=${search}&to=${search2}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer`,
              },
            }
          );

          const responseData = await response.json();
          setSalesmen(responseData.salesmen);
          setLoading(false);
        } catch (error) {
          console.log(error.message);
        }
      };
      searchFetch();
    } else {
      const searchFetch = async () => {
        try {
          const response = await fetch(
            `${apiUrl}/salesmen-detail?from=${search}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer`,
              },
            }
          );

          const responseData = await response.json();
          setSalesmen(responseData.salesmen);
          setLoading(false);
        } catch (error) {
          console.log(error.message);
        }
      };
      searchFetch();
    }
  };
  const searchBar = () => {
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
        <p className="col-2 col-md-1 order-1 order-md-3">من</p>
        <div className="col-5 offset-5 col-md-3 offset-md-0 order-2 order-md-0">
          <input
            type="date"
            className="form-control text"
            id="searchDate"
            onChange={handleSearch2Change}
          ></input>
        </div>
        <p className="col-2 col-md-1 order-3 order-md-1">الى</p>
      </Fragment>
    );
  };
  return (
    <section className="main">
      <div className="row pt-5 m-0">
        <div
          className="col-xl-10 col-lg-9 col-md-9 mr-auto main-view"
          id="main-view"
        >
          <div className="row pt-md-3 pr-2 pl-2 mt-md-3 mb-5">
            <div className="col-12">
              <div className="row mt-3">
                <div className="col-12 col-md-8 order-last order-md-first">
                  <form onSubmit={handleSearchButton}>
                    <div className="form-group row mt-1">
                      <div className="col-2 offset-1 offset-md-0 text">
                        <button
                          type="submit"
                          className="btn btn-secondary btn-sm mt-1"
                        >
                          ابحث
                        </button>
                      </div>
                      {searchBar()}
                    </div>
                  </form>
                </div>
                <div className="col-12 col-md-4 order-first order-md-last">
                  <h2 className="text text-white">حضور الطلاب</h2>
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
                      {salesmen.map((salesman) => {
                        return <th key={salesman.id}>{salesman.date}</th>;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {salesmen.map((salesman) => {
                      return (
                        <tr key={salesman.id} className="font-weight-bold">
                          <td>{salesman.name}</td>
                          <td>
                            {salesman.pharmacies.map((pharmacy) => {
                              if (salesman.pharmacies.length == 1) {
                                return `${pharmacy.name}`;
                              } else {
                                return `${pharmacy.name}, `;
                              }
                            })}
                          </td>
                          {render_report_activity(salesman.report_activity)}
                          <td>
                            <button
                              onClick={() => handleEditButton(salesman)}
                              className="btn btn-secondary text-white"
                            >
                              تعديل
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

export default StudentAttendance;
