import React, { useState, useEffect, Fragment } from "react";
import { toast } from "react-toastify";
const apiUrl = process.env.API_URL;

function AddStudent({ page, dataToChange }) {
  const [data, setData] = useState({
    zones: [],
    pharmacies: [],
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
  const handleSupportChange = (e) =>
    setDataToSend({ ...dataToSend, support: e.target.value });
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
      <div className="row pt-5 m-0">
        <div className="col-xl-10 col-lg-9 col-md-8 mr-auto">
          <div className="row pt-md-3 pr-2 pl-2 mt-md-3 mb-5">
            <div className="col-sm-12 p-2">
              <form onSubmit={handleSubmit}>
                <div className="form-group row">
                  <div className="col-md-4 offset-md-6 order-last order-md-first">
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
                    className="col-12 col-md-2 col-form-label text-center text-white order-first order-md-last"
                  >
                    اسم الطالب
                  </label>
                </div>
                <div className="form-group row">
                  <div className="col-md-4 offset-md-6 order-last order-md-first">
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
                  <div className="col-md-4 offset-md-6 order-last order-md-first">
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
                  <div className="col-md-4 offset-md-6 order-last order-md-first">
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
                  <div className="col-md-4 offset-md-6 order-last order-md-first">
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
                  <div className="col-md-4 offset-md-6 order-last order-md-first">
                    <input
                      id="photo"
                      type="file"
                      onChange={handleSupportChange}
                      className="form-control text"
                      value={dataToSend.photo}
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
                  <div className="col-10 offset-1 col-sm-3 offset-sm-6 mt-3">
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
