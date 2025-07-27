import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { ApiDomain } from "../../../../utils/APIDomain";
import { toast } from "sonner";
import { bookingsAPI } from "../../../../Features/booking/bookingsAPI";

const Checkout = () => {
  const { bookingID } = useParams();
  const { token, user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [response, setResponse] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);

  const { data: bookingData, isLoading: isBookingLoading } =
    bookingsAPI.useGetBookingByIdQuery(Number(bookingID));

  const booking = bookingData?.data[0];
  const amount = Number(booking?.totalAmount || 0); // fallback to 0 if not loaded yet

  // POLLING LOGIC
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
          toast.success(" Payment successful!");
          navigate(`/payment/receipt/${bookingID}`);
        }
      } catch (err) {
        console.warn("Polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [bookingID, token]);

  //  HANDLE PAYMENT
  const handlePayment = async () => {
    if (!bookingID || !phone || !booking) return;

    if (!token || !user) {
      toast.error("You must be logged in to pay.");
      return;
    }

    try {
      setProcessing(true);
      const { data } = await axios.post(
        `${ApiDomain}/api/mpesa/stk`,
        {
          bookingID: Number(bookingID),
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
    } catch (err: any) {
      setResponse("Payment failed to start.");
      toast.error("Failed to initiate payment.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded">
      <h2 className="text-xl font-bold mb-4">Checkout with M-Pesa</h2>

      {isBookingLoading ? (
        <p>Loading booking details...</p>
      ) : (
        <>
          <p className="mb-2">
            <strong>Total Amount:</strong> KES {amount.toFixed(2)}
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
            <p className="mt-4 text-center text-sm text-green-600">{response}</p>
          )}

          {paymentComplete && (
            <p className="mt-4 text-center text-sm text-blue-600 font-semibold">
              Payment completed. Thank you!
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Checkout;
