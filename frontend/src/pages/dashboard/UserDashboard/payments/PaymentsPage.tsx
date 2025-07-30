import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import LipaMpesaModal from "./LipaMpesaModal";
import type { RootState } from "../../../../app/store";
import { bookingsAPI } from "../../../../Features/booking/bookingsAPI";

const PaymentsPage = () => {
  const { bookingID } = useParams();
  const userID = useSelector((state: RootState) => state.user.user?.userID);
  const { data: bookingData } = bookingsAPI.useGetBookingByIdQuery(Number(bookingID));
  const [showModal, setShowModal] = useState(false);

  const amount = bookingData?.data?.totalAmount;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md p-6 mt-10 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Confirm Your Payment</h2>
      <p className="text-lg">Booking ID: {bookingID}</p>
      <p className="text-lg">Amount: Ksh {amount}</p>

      <button
        className="btn btn-primary mt-6 w-full"
        onClick={() => setShowModal(true)}
      >
        Pay via Lipa na M-Pesa
      </button>

      {showModal && (
        <LipaMpesaModal
          bookingID={Number(bookingID)}
          userID={userID!}
          amount={Number(amount) || 0}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
