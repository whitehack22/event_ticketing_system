import { useForm, type SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { type RootState } from "../../../../app/store";
import { bookingsAPI } from "../../../../Features/booking/bookingsAPI";
import { toast } from "sonner";
import { type TEvent } from "../../../../Features/events/eventsAPI";
import { useNavigate } from "react-router";

type Props = {
  event: TEvent;
  onClose: () => void;
};

type BookingForm = {
  numberOfTickets: number;
};

const BookEventModal = ({ event, onClose }: Props) => {
  const { register, handleSubmit, watch, reset } = useForm<BookingForm>({
    defaultValues: {
      numberOfTickets: 1,
    },
  });
  const navigate = useNavigate();
  const userID = useSelector((state: RootState) => state.user.user?.userID);
  const [createBooking, { isLoading }] = bookingsAPI.useCreateBookingMutation();

  const numberOfTickets = watch("numberOfTickets");
  const totalAmount = numberOfTickets * event.ticketPrice;

  const onSubmit: SubmitHandler<BookingForm> = async (data) => {
    if (!userID) {
      toast.error("You must be logged in to book.");
      return;
    }

    try {
      const response = await createBooking({
        userID,
        eventID: event.eventID,
        numberOfTickets: data.numberOfTickets,
        totalAmount: totalAmount.toFixed(2),
        bookingStatus: "Confirmed",
      }).unwrap();

      toast.success("Booking successful!");
      console.log("Booking Response:", response);
      reset();
      onClose();
      navigate(`/user/dashboard/payment/${response.booking.bookingID}`);
    } catch (error) {
      console.error(error);
      toast.error("Booking failed. Try again.");
    }
  };

  return (
    <dialog id="booking_modal" className="modal modal-open">
      <div className="modal-box bg-white text-gray-900 max-w-md">
        <h3 className="font-bold text-lg mb-4">Book Tickets for {event.title}</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Number of Tickets</label>
            <input
              type="number"
              min={1}
              max={event.availableTickets}
              {...register("numberOfTickets", { required: true, min: 1 })}
              className="input input-bordered w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Available: {event.availableTickets}
            </p>
          </div>

          <div>
            <label className="label">Total Cost</label>
            <p className="font-semibold text-lg">Ksh {totalAmount}</p>
          </div>

          <div className="modal-action flex justify-between">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Booking..." : "Confirm Booking"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default BookEventModal;
