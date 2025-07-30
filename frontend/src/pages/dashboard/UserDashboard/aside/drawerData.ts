import { FaUserCheck } from "react-icons/fa6";

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
        id: "payments",
        name: "Payments",
        icon: MdOutlinePayment,
        link: "payment/:bookingID"
    },
    {
        id: "receipt",
        name: "Payment Receipt",
        icon: FaReceipt,
        link: "payment/receipt/:bookingID"
    },
    {
        id: "paymentsHistory",
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