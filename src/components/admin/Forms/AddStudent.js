import React, { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
const apiUrl = process.env.API_URL;

function AddStudent({ page, dataToChange, sideBarShow }) {
  const [data, setData] = useState({
    zones: [],
    pharmacies: [],
    batches: [],
  });
  const [pharmacies, setPharmacies] = useState([
    { id: "", pharmacy_id: "", name: "" },
  ]);
  const [dataToSend, setDataToSend] = useState({
    id: "",
    name: "",
    date_of_joining: "",
    email: "",
    zone_id: "",
    phone: "",
    speciality: "",
    d_class: "",
    pharmacy_id: "",
    support: "",
    photo: "",
  });
  const [saving, setSaving] = useState(false);
  const [choosenPharmacies, setChoosenPharmacies] = useState([]);
  useEffect(() => {
    const getStuff = async () => {
      try {
        const response = await fetch(`${apiUrl}/doctors-form`, {
          method: "GET",
          headers: {
            Authorization: `Bearer`,
          },
        });

        const responseData = await response.json();
        setData(responseData);
        setChoosenPharmacies(responseData.pharmacies);
      } catch (error) {
        console.log(error.message);
      }
    };
    getStuff();
    if (Object.keys(dataToChange).length != 0) {
      setDataToSend(dataToChange);
      if (dataToChange.pharmacies.length != 0) {
        setPharmacies(dataToChange.pharmacies);
      }
    }
  }, []);
  const handleDoctorChange = (e) =>
    setDataToSend({ ...dataToSend, name: e.target.value });
  const handleZoneChange = (e) => {
    setChoosenPharmacies(
      [...data.pharmacies].filter((p) => p.zone_id == e.target.value)
    );
    setDataToSend({ ...dataToSend, zone_id: e.target.value });
  };
  const handleDateChange = (e) =>
    setDataToSend({ ...dataToSend, date_of_joining: e.target.value });
  const handleEmailChange = (e) =>
    setDataToSend({ ...dataToSend, email: e.target.value });
  const handlePhoneChange = (e) =>
    setDataToSend({ ...dataToSend, phone: e.target.value });
  const handleSpecialityChange = (e) =>
    setDataToSend({ ...dataToSend, speciality: e.target.value });
  const handleD_classChange = (e) =>
    setDataToSend({ ...dataToSend, d_class: e.target.value });
  const handlePharmacyChange = (e, i) => {
    let nee = [...pharmacies];
    nee[i] = {
      ...nee[i],
      pharmacy_id: e.target.value,
    };
    setPharmacies(nee);
    setDataToSend({ ...dataToSend, pharmacies: nee });
  };
  const handlePhotoChange = (e) => {
    setDataToSend({
      ...dataToSend,
      photo: e.target.files[0].name,
    });

    var fr = new FileReader();
    fr.onload = function (event) {
      document.getElementById("myimage").src = event.target.result;
    };
    fr.readAsDataURL(e.target.files[0]);
  };
  const handleSupportChange = (e) => {
    setDataToSend({ ...dataToSend, support: e.target.value });
  };
  const handleAddPharmacyButton = (e) => {
    setPharmacies([...pharmacies, { id: "", pharmacy_id: "", name: "" }]);
  };
  const handleRemovePharmacyButton = (e) => {
    const list = [...pharmacies];
    if (list.length > 1) {
      list.pop();
      setPharmacies(list);
    }
  };
  const saveDoctor = async () => {
    try {
      setSaving(true);
      const response = await fetch(
        `${apiUrl}/doctors` +
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

      toast.success("تم حفظ الطبيب");
      page();
    } catch (error) {
      console.log(error.message);
      setSaving(false);
      toast.error("فشل الحفظ");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    saveDoctor();
  };
  return (
    <section className="main">
      <div className="row padding-form m-0">
        <div
          className={
            sideBarShow
              ? "width-others-wide mr-auto main-view"
              : "width-others-narrow mr-auto main-view"
          }
          id="main-view"
        >
          <div className="row pt-md-3 pr-2 pl-2 mt-md-3 mb-5">
            <div className="col-5">
              <div className="col-2 offset-6 order-last order-md-first mt-5">
                {dataToSend.photo ? (
                  <img id="myimage" className="img-student-attendance" />
                ) : (
                  <img src="" className="img-student-attendance" />
                )}
              </div>
            </div>
            <div className="col-7 p-2">
              <form onSubmit={handleSubmit}>
                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <input
                      id="doctor"
                      type="text"
                      placeholder="الاسم"
                      className="form-control text"
                      onChange={handleDoctorChange}
                      value={dataToSend.name}
                      required
                    ></input>
                  </div>
                  <label
                    htmlFor="doctor"
                    className="col-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    اسم الطالب
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <select
                      id="zone"
                      onChange={handleZoneChange}
                      className="form-control"
                      dir="rtl"
                      value={dataToSend.zone_id}
                      required
                    >
                      <option selected>اختر</option>
                      {data.zones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.zone}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label
                    htmlFor="zone"
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    المعهد
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <select
                      id="batch"
                      onChange={handleZoneChange}
                      className="form-control"
                      dir="rtl"
                      value={dataToSend.batch_id}
                      required
                    >
                      <option selected>اختر</option>
                      {data.batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                          {batch.batch}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label
                    htmlFor="batch"
                    className="col-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    الدفعة
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <input
                      id="phone"
                      type="text"
                      placeholder="07XX-XXXXXXX"
                      onChange={handlePhoneChange}
                      className="form-control text"
                      value={dataToSend.phone}
                    ></input>
                  </div>
                  <label
                    htmlFor="phone"
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    رقم الهاتف
                  </label>
                </div>

                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <input
                      id="date"
                      type="date"
                      className="form-control text"
                      onChange={handleDateChange}
                      value={dataToSend.date_of_joining}
                      required
                    ></input>
                  </div>
                  <label
                    htmlFor="date"
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    تاريخ الميلاد
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <input
                      id="support"
                      type="text"
                      onChange={handleSupportChange}
                      placeholder="الدعم"
                      className="form-control text"
                      value={dataToSend.support}
                      required
                    ></input>
                  </div>
                  <label
                    htmlFor="support"
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    الملاحظات
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-7 offset-1 order-last order-md-first">
                    <input
                      id="photo"
                      type="file"
                      onChange={handlePhotoChange}
                      className="form-control text"
                      required
                    ></input>
                  </div>
                  <label
                    htmlFor="photo"
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    الصورة
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-3 offset-2 mt-3">
                    {!saving ? (
                      <button
                        type="submit"
                        className="btn btn-success btn-block"
                      >
                        حفظ الطالب
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

export default AddStudent;
