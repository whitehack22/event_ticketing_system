import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { FiUsers } from "react-icons/fi";
import { FaUserCheck } from "react-icons/fa6";
import { IoTicketSharp } from "react-icons/io5";
import { RiCustomerServiceFill } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineFestival } from "react-icons/md";


export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    link: string;
}

export const adminDrawerData: DrawerData[] = [

    
    {
        id: "events",
        name: "Events",
        icon: MdOutlineFestival,
        link: "events"
    },
    {
        id: "venues",
        name: "Venues",
        icon: FaMapMarkerAlt,
        link: "venues"
    },
    {
        id: "bookings",
        name: "Bookings",
        icon: IoTicketSharp,
        link: "bookings"
    },
    {
        id: "payments",
        name: "Payments",
        icon: MdOutlinePayment,
        link: "payments"
    },
    {
        id: "users",
        name: "Manage Users",
        icon: FiUsers,
        link: "users"
    },
    {
        id: "customerSupport",
        name: "Customer Support",
        icon: RiCustomerServiceFill,
        link: "customerSupport"
    },
    
    {
        id: "analytics",
        name: "Analytics",
        icon: TbBrandGoogleAnalytics,
        link: "analytics"
    },
     {
        id: "profile",
        name: "Profile",
        icon: FaUserCheck,
        link: "profile"
    },

]