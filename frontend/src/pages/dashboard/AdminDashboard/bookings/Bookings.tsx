import { bookingsAPI } from "../../../../Features/booking/bookingsAPI";

const Bookings = () => {
  const { data: bookingsData, isLoading, error } = bookingsAPI.useGetBookingsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  return (
    <div className="p-4">

      {/* Table Display */}
      {isLoading && <p>Loading bookings...</p>}
      {error && <p className="text-red-500">Error fetching bookings</p>}

      {bookingsData?.data?.length ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th>Booking ID</th>
                <th>User ID</th>
                <th>Event ID</th>
                <th>Number of Tickets</th>
                <th>Total Amount</th>
                <th>Booking Date</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {bookingsData.data.map((booking) => (
                <tr key={booking.bookingID} className="hover:bg-gray-100">
                  <td>{booking.bookingID}</td>
                  <td>{booking.userID}</td>
                  <td>{booking.eventID}</td>
                  <td>{booking.numberOfTickets}</td>
                  <td>{booking.totalAmount}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${booking.bookingStatus ? "badge-success" : "badge-error"}`}
                    >
                      {booking.bookingStatus ? "Confirmed" : "Not Confirmed"}
                    </span>
                  </td>
                  <td>
                  {new Date(booking.createdAt).toLocaleString("en-GB", {
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
                  {new Date(booking.updatedAt).toLocaleString("en-GB", {
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
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default Bookings;
