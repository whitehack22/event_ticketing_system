import CustomerSupportForm from "../../../../components/customer_support/CustomerSupportForm";
import TicketHistory from "../../../../components/customer_support/TicketHistory";

const UserCustomerSupport = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Customer Support</h1>
      <CustomerSupportForm />
      <TicketHistory />
    </div>
  );
};

export default UserCustomerSupport;
