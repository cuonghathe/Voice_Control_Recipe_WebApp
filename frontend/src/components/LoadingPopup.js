import React from "react";
import "./DescriptionBox/DescriptionBox.scss";

const LoadingPopup = ({ isLoading = false}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="popup">
      <div className="poppup_container">
        <div className="popup_icon">
          <i className="fa-solid fa-hourglass-end"></i>
        </div>
        <div className="popup_message">
          <h2>Đang xử lý</h2>
        </div>
      </div>
      <label className="nav-overlay"></label>
    </div>
  );
};

export default LoadingPopup;
