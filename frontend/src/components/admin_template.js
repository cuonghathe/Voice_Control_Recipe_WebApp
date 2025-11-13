import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../pages/Admin/Admin_header/Admin_header";
import "../pages/Admin/admin.scss";

const AdminTemplate = () => {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminTemplate;
