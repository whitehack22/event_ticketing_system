import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { toast } from "sonner";
import { mpesaAPI } from "../../../../Features/mpesa/mpesaAPI";

type Props = {
  bookingID: number;
  amount: number;
  onClose: () => void;
};

const CheckoutModal = ({ bookingID, amount, onClose }: Props) => {
  const { token, user } = useSelector((state: RootState) => state.user);
  const [phone, setPhone] = useState("");
  const [response, setResponse] = useState("");
  const [paymentComplete, setPaymentComplete] = useState(false);

  const [initiateSTK, { isLoading: isInitiating }] = mpesaAPI.useInitiateSTKMutation();
  const { data: paymentData } = mpesaAPI.useGetPaymentStatusQuery(bookingID, {
    pollingInterval: 5000,
    skip: !bookingID,
  });

  useEffect(() => {
    const status = paymentData?.data?.[0]?.paymentStatus;
    if (status === "Completed") {
      setPaymentComplete(true);
      toast.success("Payment successful!");
      onClose();
      window.location.href = `/user/dashboard/payment/receipt/${bookingID}`;
    }
  }, [paymentData]);

  const handlePayment = async () => {
    if (!phone) {
      toast.error("Please enter your phone number.");
      return;
    }

    if (!token || !user) {
      toast.error("You must be logged in to pay.");
      return;
    }

    try {
      const result = await initiateSTK({ phone, amount, bookingID }).unwrap();
      setResponse(result?.paymentStatus || "STK push sent.");
      toast.info("STK push sent. Complete payment on your phone.");
    } catch (err: any) {
      toast.error("Failed to initiate payment.");
      console.error(err);
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
          disabled={isInitiating || paymentComplete}
        />

        <button
          onClick={handlePayment}
          disabled={isInitiating || paymentComplete}
          className="btn btn-primary w-full flex items-center justify-center"
        >
          {paymentComplete ? (
            "✅ Paid"
          ) : isInitiating ? (
            <>
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </button>

        {isInitiating && (
          <p className="mt-4 text-center text-gray-500 text-sm italic">
            Sending STK Push to your phone...
          </p>
        )}

        {response && (
          <p className="mt-4 text-center text-green-600 text-sm">{response}</p>
        )}

        {paymentComplete && (
          <p className="mt-4 text-center text-blue-600 text-sm font-semibold">
            Payment completed. Thank you!
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
