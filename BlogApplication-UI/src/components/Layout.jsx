import React from "react";
import Navbar from "./Navbar";
import { Outlet, Navigate } from "react-router-dom";

const Layout = () => {
  const isAuthenticated = !!localStorage.getItem("username");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
