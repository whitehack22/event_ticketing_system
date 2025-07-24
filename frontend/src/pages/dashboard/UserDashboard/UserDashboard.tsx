import { useState } from "react";
import { Outlet } from "react-router";
import Navbar from "../../../components/nav/Navbar";
import Footer from "../../../components/footer/Footer";
import UserDrawer from "./aside/UserDrawer";
import { FaBars } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

const UserDashboard = () => {
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(true);

  const handleDrawerToggle = () => {
    setIsDrawerExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Top bar */}
      <div className="flex px-6 py-4 bg-gradient-to-b from-gray-800 to-gray-900 text-white items-center shadow">
        <button
          className="mr-4 text-gray-300 hover:text-white text-2xl"
          onClick={handleDrawerToggle}
        >
          {isDrawerExpanded ? <IoCloseSharp /> : <FaBars />}
        </button>
        <span className="text-xl font-semibold">
          Welcome to the User Dashboard
        </span>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 transition-all duration-300 ease-in-out">
        {/* Drawer */}
        <aside
          className={`bg-gray-900 text-white h-full transition-all duration-300 ease-in-out ${
            isDrawerExpanded ? "w-64" : "w-16"
          }`}
        >
          <UserDrawer isSidebarOpen={isDrawerExpanded} onToggle={handleDrawerToggle} />
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-50 p-6 overflow-auto shadow-inner transition-all duration-300">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
