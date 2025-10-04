import React from "react";
import Navbar from "./Navbar";
import { Outlet, Navigate } from "react-router-dom";

const Layout = () => {
  const isAuthenticated = !!localStorage.getItem("username");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
