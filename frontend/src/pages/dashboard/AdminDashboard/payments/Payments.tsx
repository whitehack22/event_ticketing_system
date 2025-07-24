import { paymentsAPI} from "../../../../Features/payments/paymentsAPI";

const Payments = () => {
  const { data: paymentsData, isLoading, error } = paymentsAPI.useGetPaymentsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const statusBadgeClass: Record<string, string> = {
  Pending: "badge-warning",
  Completed: "badge-success",
  Failed: "badge-error",
  Refunded: "badge-info",
};


  return (
    <div className="p-4">

      {/* Table Display */}
      {isLoading && <p>Loading payments...</p>}
      {error && <p className="text-red-500">Error fetching payments</p>}

      {paymentsData?.data?.length ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th>Payment ID</th>
                <th>Booking ID</th>
                <th>User ID</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Payment Date</th>
                <th>Payment Method</th>
                <th>Transaction ID</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {paymentsData.data.map((payment) => (
                <tr key={payment.paymentID} className="hover:bg-gray-100">
                  <td>{payment.paymentID}</td>
                  <td>{payment.bookingID}</td>
                  <td>{payment.userID}</td>
                  <td>{payment.amount}</td>
                 <td>
                <span className={`badge ${statusBadgeClass[payment.paymentStatus] || "badge-ghost"}`}>
                    {payment.paymentStatus}
                </span>
                </td>
                  <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{payment.transactionID}</td>
                  <td>
                  {new Date(payment.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Africa/Nairobi", // Force EAT
                  })}
                </td>
                  <td>
                  {new Date(payment.updatedAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Africa/Nairobi", // Force EAT
                  })}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No payments found.</p>
      )}
    </div>
  );
};

export default Payments;
