import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/images/logo.png"
import { NavLink, useNavigate } from 'react-router';
import type { RootState } from "../../app/store";
import { logout } from "../../Features/login/userSlice";

const Navbar = () => {
    const userrole = useSelector((state: RootState) => state.user.user?.role);
    const userToken = useSelector((state: RootState) => state.user.token);
    const isAdmin = userrole === 'admin';
    const isUser = userrole === 'user';
    const dispatch = useDispatch();
    const navigate = useNavigate();
  return (
    <div>
      <div className="navbar bg-red-300 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        // tabIndex={0}
                        className="menu menu-sm dropdown-content rounded-box z-1 mt-3 w-52 p-2 shadow text-base-content bg-gray-700 h-[60vh]">
                        <ul className="menu  px-1">
                            <li className="font-bold text-lg text-white">
                                <NavLink to="/">Home</NavLink>
                            </li>
                            <li className="font-bold text-lg  text-white">
                                <NavLink to="/about">About</NavLink>
                            </li> 
                        
                            <li className="font-bold text-lg  text-white">
                                <NavLink to={isAdmin ? "/admin/dashboard/events" : isUser ? "/user/dashboard/events" : "/login"}>
                                        Dashboard
                                    </NavLink>
                            </li>
                            {!userToken && (
                                    <>
                                        <li className="font-bold text-lg text-white">
                                            <NavLink to="/register">Register</NavLink>
                                        </li>
                                        <li className="font-bold text-lg text-white">
                                            <NavLink to="/login">Login</NavLink>
                                        </li>
                                    </>
                                )}
                        </ul>
                    </ul>
                </div>

                {/* Desktop */}
                <img src={logo} alt="" className="w-17 ml-8 hidden sm:block " />
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 ">
                    <li className="font-bold text-lg text-gray-700 hover:text-gray-100">
                        <NavLink to="/">Home</NavLink>
                    </li>
                    <li className="font-bold text-lg text-gray-700 hover:text-gray-100">
                        <NavLink to="/about">About</NavLink>
                    </li>
                        <li className="font-bold text-lg text-gray-700 hover:text-gray-100">
                              <NavLink to={isAdmin ? "/admin/dashboard/events" : isUser ? "/user/dashboard/events" : "/login"}>
                                    Dashboard
                                </NavLink>
                            </li>
                </ul>
            </div>
            <div className="navbar-end">
                <div className='flex gap-4 mr-4 '>
                    {!userToken && (
                                    <>
                                        <li className="font-bold text-lg text-gray-700 hover:text-gray-100 list-none">
                                            <NavLink to="/register">Register</NavLink>
                                        </li>
                                        <li className="font-bold text-lg text-gray-700 hover:text-gray-100 list-none">
                                            <NavLink to="/login">Login</NavLink>
                                        </li>
                                    </>
                                )}
                </div>
                
                {userToken && (
                <li className="list-none mr-7">
              <button className="btn btn-outline rounded-full text-gray-700 hover:bg-gray-100 transition duration-300 shadow-sm"
              onClick={() => {
                                dispatch(logout());
                                    navigate("/")                                
                            }}
              >
                Log Out
              </button>
            </li>
            )}
            </div>
        </div >
    </div>
  )
}

export default Navbar