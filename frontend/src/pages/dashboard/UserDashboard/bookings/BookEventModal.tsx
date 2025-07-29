import { useState } from "react";
import { useSelector } from "react-redux";
import { bookingsAPI } from "../../../../Features/booking/bookingsAPI";
import type { RootState } from "../../../../app/store";
import { toast } from "sonner";
import type { TEvent } from "../../../../Features/events/eventsAPI";
import CheckoutModal from "../bookings/CheckoutModal";

type Props = {
  event: TEvent;
  onClose: () => void;
};

const BookEventModal = ({ event, onClose }: Props) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [tickets, setTickets] = useState(1);
  const [createBooking, { isLoading }] = bookingsAPI.useCreateBookingMutation();

  const [showCheckout, setShowCheckout] = useState(false);
  const [bookingID, setBookingID] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<string>("");

  const handleBooking = async () => {
    if (!user || !event) return;

    if (tickets > event.availableTickets) {
      toast.warning(`Only ${event.availableTickets} tickets available.`);
      return;
    }

    const totalAmount = (Number(tickets) * Number(event.ticketPrice)).toFixed(2);

    try {
      const booking = await createBooking({
        userID: user.userID,
        eventID: event.eventID,
        numberOfTickets: tickets,
        totalAmount,
      }).unwrap();

      toast.success("Booking created! Proceed to checkout.");
      console.log("Booking created:", booking);
      setBookingID(booking.bookingID);
      setTotalAmount(totalAmount); // store total
      setShowCheckout(true);
    } catch (error) {
      toast.error("Failed to create booking. Try again.");
    }
  };

  return (
    <>
      {/* Booking Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-md">
          <h2 className="text-xl font-bold mb-4">Book "{event.title}"</h2>
          <p className="mb-2 text-gray-700">
            <strong>Price:</strong> Ksh {event.ticketPrice}
          </p>
          <p className="mb-2 text-gray-700">
            <strong>Available Tickets:</strong> {event.availableTickets}
          </p>

          <label className="block font-medium mb-1">Number of Tickets</label>
          <input
            type="number"
            value={tickets}
            min={1}
            max={event.availableTickets}
            onChange={(e) => setTickets(Number(e.target.value))}
            className="input input-bordered w-full mb-4"
          />

          <div className="flex justify-between items-center">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleBooking}
              disabled={isLoading}
            >
              {isLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && bookingID !== null && (
        <CheckoutModal
          bookingID={bookingID}
          amount={parseFloat(totalAmount)}
          onClose={() => {
            setShowCheckout(false);
            onClose();
          }}
        />
      )}

    </>
  );
};

export default BookEventModal;
