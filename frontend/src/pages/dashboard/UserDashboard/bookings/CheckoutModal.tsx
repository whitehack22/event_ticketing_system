import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { ApiDomain } from "../../../../utils/APIDomain";
import { toast } from "sonner";
import { bookingsAPI } from "../../../../Features/booking/bookingsAPI";

type Props = {
  bookingID: number;
  onClose: () => void;
};

const CheckoutModal = ({ bookingID, onClose }: Props) => {
  const { token, user } = useSelector((state: RootState) => state.user);
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);

  const { data: bookingData, isLoading: isBookingLoading } =
    bookingsAPI.useGetBookingByIdQuery(bookingID);

  const booking = bookingData?.data[0];
  const amount = Number(booking?.totalAmount || 0);

  // POLLING
  useEffect(() => {
    if (!bookingID) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await axios.get(
          `${ApiDomain}/api/payment/booking/${bookingID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const status = data?.data[0]?.paymentStatus;
        if (status === "Completed") {
          clearInterval(interval);
          setPaymentComplete(true);
          toast.success("Payment successful!");
          onClose(); // Close modal
          window.location.href = `/user/dashboard/payment/receipt/${bookingID}`;
        }
      } catch (err) {
        console.warn("Polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [bookingID, token]);

  const handlePayment = async () => {
    if (!booking || !phone) return;
    if (!token || !user) {
      toast.error("You must be logged in to pay.");
      return;
    }

    try {
      setProcessing(true);
      const { data } = await axios.post(
        `${ApiDomain}/api/mpesa/stk`,
        {
          bookingID,
          phone,
          amount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResponse(data.CustomerMessage || "STK push sent.");
      toast.info("STK push sent. Complete payment on your phone.");
    } catch (err) {
      toast.error("Failed to initiate payment.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">
          Checkout with M-Pesa
        </h2>

        {isBookingLoading ? (
          <p className="text-center text-gray-600">Loading booking...</p>
        ) : (
          <>
            <p className="mb-2 text-center text-lg font-medium">
              <strong>Total:</strong> KES {amount.toFixed(2)}
            </p>

            <label className="block font-medium mb-2">M-Pesa Phone Number</label>
            <input
              type="tel"
              placeholder="2547XXXXXXXX"
              className="input input-bordered w-full mb-4"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={processing || paymentComplete}
            />

            <button
              onClick={handlePayment}
              disabled={processing || paymentComplete}
              className="btn btn-primary w-full"
            >
              {paymentComplete
                ? "✅ Paid"
                : processing
                ? "Processing..."
                : "Pay Now"}
            </button>

            {response && (
              <p className="mt-4 text-center text-green-600 text-sm">{response}</p>
            )}

            {paymentComplete && (
              <p className="mt-4 text-center text-blue-600 text-sm font-semibold">
                Payment completed. Thank you!
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
