import { FaUserCheck } from "react-icons/fa6";
import { IoTicketSharp } from "react-icons/io5";
import { RiCustomerServiceFill } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";
import { MdOutlineFestival } from "react-icons/md";
import { FaReceipt } from "react-icons/fa";


export type DrawerData = {
    id: string;
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    link: string;
}

export const userDrawerData: DrawerData[] = [

    
    {
        id: "events",
        name: "Events",
        icon: MdOutlineFestival,
        link: "events"
    },
    {
        id: "bookings",
        name: "Bookings",
        icon: IoTicketSharp,
        link: "bookings"
    },
    {
        id: "receipt",
        name: "Payment Receipt",
        icon: FaReceipt,
        link: "payment/receipt/:bookingID"
    },
    {
        id: "payments",
        name: "Payment History",
        icon: MdOutlinePayment,
        link: "payments"
    },
    {
        id: "customerSupport",
        name: "Customer Support",
        icon: RiCustomerServiceFill,
        link: "customerSupport"
    },
     {
        id: "profile",
        name: "Profile",
        icon: FaUserCheck,
        link: "profile"
    },

]