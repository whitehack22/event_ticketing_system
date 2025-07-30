import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { mpesaAPI } from "../../../../Features/mpesa/mpesaAPI";
import { paymentsAPI } from "../../../../Features/payments/paymentsAPI";
import { useNavigate } from "react-router";

type Props = {
  bookingID: number;
  userID: number;
  amount: number;
  onClose: () => void;
};

const LipaMpesaModal = ({ bookingID, userID, amount, onClose }: Props) => {
  const { register, handleSubmit, reset } = useForm<{ phone: string }>();
  const [initiateSTK, { isLoading }] = mpesaAPI.useInitiateSTKMutation();
  const [createPayment] = paymentsAPI.useCreatePaymentMutation();
  const navigate = useNavigate();

  const onSubmit = async ({ phone }: { phone: string }) => {
    try {
      // Simulate STK Push
      await initiateSTK({
        phone,
        amount,
      }).unwrap();

      // Simulate saving the payment to the DB
      await createPayment({
        bookingID,
        userID,
        amount,
        paymentMethod: "M-Pesa",
        // `paymentStatus` defaults to "Completed"
      });

      toast.success("M-Pesa payment simulated successfully!");
      reset();
      onClose();
      navigate(`/user/dashboard/payment/receipt/${bookingID}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to simulate payment.");
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box bg-white text-gray-800 max-w-md">
        <h3 className="text-xl font-bold mb-4">Simulate M-Pesa Payment</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Phone Number</label>
            <input
              type="tel"
              {...register("phone", { required: true })}
              placeholder="e.g. 254712345678"
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">Amount</label>
            <p className="text-lg font-semibold">Ksh {amount}</p>
          </div>

          <div className="modal-action flex gap-2 justify-end">
            <button type="button" className="btn btn-ghost" onClick={() => {
              reset();
              onClose();
            }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm Payment"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default LipaMpesaModal;
