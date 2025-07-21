import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Footer from "../../../components/footer/Footer";
import AdminDrawer from "./aside/AdminDrawer";
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import type { RootState } from "../../../app/store";
import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = useSelector((state: RootState) => state.user.user);

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Top bar */}
      <div className="flex px-6 py-4 bg-gradient-to-b from-gray-800 to-gray-900 text-white items-center shadow">
        <button
          className="mr-4 text-2xl lg:hidden"
          onClick={handleDrawerToggle}
        >
          {drawerOpen ? <IoCloseSharp /> : <FaBars />}
        </button>
        <span className="text-xl font-semibold">
          Welcome to the Admin Dashboard {user?.firstName}
        </span>
      </div>

      <div className="flex flex-1">
        {/* Drawer */}
        <aside
          className={`bg-white transition-all duration-300 ease-in-out ${
            drawerOpen ? "block" : "hidden"
          } fixed top-0 z-40 w-64 lg:static lg:block`}
          style={{ minHeight: "100vh" }}
        >
          <div className="h-full relative">
            {/* Close button for mobile */}
            <button
              className="absolute top-4 right-4 text-white text-xl lg:hidden"
              onClick={handleDrawerToggle}
            >
              <IoCloseSharp />
            </button>
            <AdminDrawer />
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-auto shadow-inner">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
