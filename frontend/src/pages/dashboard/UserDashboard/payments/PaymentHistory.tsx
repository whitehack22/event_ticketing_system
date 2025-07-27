import { paymentsAPI } from "../../../../Features/payments/paymentsAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";

const PaymentHistory = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const userID = user?.userID;

  const { data, isLoading, error } = paymentsAPI.useGetPaymentByUserIdQuery(
    Number(userID)
  );

  if (isLoading) return <p>Loading payments...</p>;
  if (error) return <p>Failed to load payment history.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">💳 Payment History</h2>

      {data?.data.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Booking ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((p) => (
              <tr key={p.paymentID}>
                <td>{p.paymentID}</td>
                <td>{p.bookingID}</td>
                <td>KES {p.amount}</td>
                <td>{p.paymentStatus}</td>
                <td>{new Date(p.paymentDate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;
