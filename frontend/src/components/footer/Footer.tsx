import { FaTwitter } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink } from 'react-router';
import type { RootState } from "../../app/store";

const Footer = () => {
    const userrole = useSelector((state: RootState) => state.user.user?.role);
    const isAdmin = userrole === 'admin';
    const isUser = userrole === 'user';
  return (
    <div>
      <footer className="footer sm:footer-horizontal bg-red-300 text-base-content p-10">
            <nav>
                <h6 className="footer-title">Services</h6>
                <li className="link link-hover list-none hover:text-gray-100"><NavLink to={isAdmin ? "/admin/dashboard/venues" : isUser ? "/user/dashboard/venues" : "/login"}>Venues</NavLink></li>
                <li className="link link-hover list-none hover:text-gray-100"><NavLink to={isAdmin ? "/admin/dashboard/events" : isUser ? "/user/dashboard/events" : "/login"}>Events</NavLink></li>
                <li className="link link-hover list-none hover:text-gray-100"><NavLink to={isUser ? "/user/dashboard/bookings" : "/login"}>Booking an Event</NavLink></li>
                <li className="link link-hover list-none hover:text-gray-100"><NavLink to={isUser ? "/user/dashboard/customerSupport" : "/login"}>Customer Support</NavLink></li>

             </nav>
            <nav>
                <h6 className="footer-title">Company</h6>
                <li className="link link-hover list-none hover:text-gray-100"><NavLink to="/about">About Us</NavLink></li>
                <li className="link link-hover list-none hover:text-gray-100">Contact Us</li>
            </nav>
            <nav>
                <h6 className="footer-title">Social</h6>
                <div className="grid grid-flow-col gap-4">
                <a>
                            <FaTwitter className="text-2xl cursor-pointer hover:text-gray-100" />
                        </a>
                        <a>
                            <FaYoutube className="text-2xl cursor-pointer hover:text-gray-100" />
                        </a>
                        <a>
                            <FaFacebook className="text-2xl cursor-pointer hover:text-gray-100" />
                        </a>
                </div>
            </nav>
        </footer>
    </div>
  )
}

export default Footer