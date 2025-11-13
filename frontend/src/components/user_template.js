import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";


const UserTemplate = () => {
  return (
    <div>
      <Header />
      <div className="outLet">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default UserTemplate;
