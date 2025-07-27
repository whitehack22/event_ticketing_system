import { useParams } from "react-router-dom";
import { paymentsAPI } from "../../../../Features/payments/paymentsAPI";

const Receipt = () => {
  const { bookingID } = useParams();

  const { data, isLoading, error } = paymentsAPI.useGetPaymentByUserIdQuery(
    Number(localStorage.getItem("userID")) // or get it from Redux
  );

  const payment = data?.data.find(
    (p) => p.bookingID === Number(bookingID)
  );

  if (isLoading) return <p>Loading receipt...</p>;
  if (error || !payment) return <p>No receipt found for this booking.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-xl font-semibold mb-4">🎟️ Payment Receipt</h2>
      <p><strong>Payment ID:</strong> {payment.paymentID}</p>
      <p><strong>Booking ID:</strong> {payment.bookingID}</p>
      <p><strong>Amount:</strong> KES {payment.amount}</p>
      <p><strong>Status:</strong> {payment.paymentStatus}</p>
      <p><strong>Method:</strong> {payment.paymentMethod}</p>
      <p><strong>Date:</strong> {new Date(payment.paymentDate).toLocaleString()}</p>
    </div>
  );
};

export default Receipt;
