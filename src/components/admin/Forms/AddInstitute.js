import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
const apiUrl = process.env.API_URL;

function AddInsitute({ page, dataToChange, sideBarShow }) {
  const [dataToSend, setDataToSend] = useState({
    id: "",
    name: "",
  });
  useEffect(() => {
    if (Object.keys(dataToChange).length) {
      setDataToSend(dataToChange);
    }
  }, []);
  const handleNameChange = (e) =>
    setDataToSend({ ...dataToSend, name: e.target.value });
  const [saving, setSaving] = useState(false);
  const saveInstitute = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `${apiUrl}/institutes` +
          `${dataToSend.id != "" ? "/" + dataToSend.id : ""}`,
        {
          method: dataToSend.id != "" ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const responseData = await response.json();

      toast.success("تم حفظ المعهد");
      page();
    } catch (error) {
      console.log(error.message);
      setSaving(false);
      toast.error("فشل الحفظ");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    saveInstitute();
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
            <div className="col-sm-12 p-2">
              <form onSubmit={handleSubmit}>
                <div className="form-group row">
                  <div className="col-md-4 offset-md-6 order-last order-md-first">
                    <input
                      type="text"
                      placeholder="الاسم"
                      className="form-control text"
                      onChange={handleNameChange}
                      value={dataToSend.name}
                      required
                    ></input>
                  </div>
                  <label
                    htmlFor="institute"
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    اسم المعهد
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-10 offset-1 col-sm-3 offset-sm-6 mt-3">
                    {!saving ? (
                      <button
                        type="submit"
                        className="btn btn-success btn-block"
                      >
                        حفظ المعهد
                      </button>
                    ) : (
                      <button disabled className="btn btn-success btn-block">
                        يتم الارسال
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddInsitute;
