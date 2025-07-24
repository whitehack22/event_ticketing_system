import { NavLink } from "react-router-dom";
import { adminDrawerData } from "./drawerData";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";

type AdminDrawerProps = {
  isSidebarOpen: boolean;
  onToggle: () => void;
};


const AdminDrawer = ({ isSidebarOpen }: AdminDrawerProps) => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <div className={`h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex flex-col items-center w-full">
          <img
            src={user?.image_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
            alt="Avatar"
            className="rounded-full w-16 h-16 border-2 border-gray-600 mr-4"
          />
          {isSidebarOpen && (
            <>
              <h2 className="mt-2 text-sm font-semibold text-center mr-2">{user?.firstName} {user?.lastName}</h2>
              <p className="text-xs text-gray-400 text-center mr-2">{user?.email}</p>
            </>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto mt-4">
        <ul className="space-y-2 px-2">
          {adminDrawerData.map(({ id, name, icon: Icon, link }) => (
            <li key={id}>
              <NavLink
                to={link}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                    isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />
                {isSidebarOpen && <span>{name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminDrawer;
