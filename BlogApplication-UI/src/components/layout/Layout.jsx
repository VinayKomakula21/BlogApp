import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-right" />
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
