import React from "react";

function AdminFooter({ sideBarShow }) {
  return (
    <footer>
      <div
        className={
          sideBarShow
            ? "width-others-wide fixed-bottom mr-auto admin-nav-bg bottom-bar"
            : "width-others-wide fixed-bottom mr-auto admin-nav-bg bottom-bar"
        }
        id="bottom-bar"
      >
        <div className="row justify-content-center mt-3">
          <div className="col-auto">
            <p className="text-white text-center">
              Copyright &copy; 2021 by BeSmarty inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AdminFooter;
