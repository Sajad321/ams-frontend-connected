import React from "react";

function AdminFooter() {
  return (
    <footer>
      <div
        className="col-xl-10 col-lg-9 col-md-9 fixed-bottom mr-auto admin-nav-bg bottom-bar"
        id="bottom-bar"
      >
        <div className="row justify-content-center mt-3">
          <div className="col-auto">
            <p className="text-white text-center">
              Copyright &copy; 2021 by SH inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
