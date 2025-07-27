import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { bookingsAPI } from "../../../../Features/booking/bookingsAPI";
import { eventsAPI } from "../../../../Features/events/eventsAPI";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../app/store";
import { toast } from "sonner";

const BookEvent = () => {
  const { eventID } = useParams();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState(1);
  const [createBooking, { isLoading }] = bookingsAPI.useCreateBookingMutation();

  const { data: eventData, isLoading: isEventLoading } = eventsAPI.useGetEventByIdQuery(Number(eventID));
  const event = eventData?.data[0];

  const handleBooking = async () => {
    if (!user || !eventID || !event) return;

    if (tickets > event.availableTickets) {
      toast.warning(`Only ${event.availableTickets} tickets are available.`);
      return;
    }

    const totalAmount = (Number(tickets) * Number(event.ticketPrice)).toFixed(2);

    try {
    const booking = await createBooking({
      userID: user.userID,
      eventID: Number(eventID),
      numberOfTickets: tickets,
      totalAmount,
    }).unwrap();

    toast.success("Booking created! Redirecting to checkout...");
    navigate(`/user/dashboard/checkout/${booking.bookingID}`);
    } catch (error) {
    toast.error("Failed to create booking. Please try again.");
    }
 };

  if (isEventLoading) return <p className="text-center mt-8">Loading event...</p>;
  if (!event) return <p className="text-center mt-8">Event not found.</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-xl font-semibold mb-4">Book Your Ticket for "{event.title}"</h2>
      <p className="mb-2 text-sm text-gray-600">
        <strong>Available Tickets:</strong> {event.availableTickets}
      </p>
      <label className="block mb-2 font-medium">Number of Tickets</label>
      <input
        type="number"
        value={tickets}
        min={1}
        max={event.availableTickets}
        onChange={(e) => setTickets(Number(e.target.value))}
        className="input input-bordered w-full mb-4"
        disabled={event.availableTickets === 0}
      />
      <p className="mb-4 text-gray-600">
        <strong>Total:</strong> Ksh {(Number(tickets) * Number(event.ticketPrice)).toFixed(2)}
      </p>
      <button
        onClick={handleBooking}
        className="btn btn-primary w-full"
        disabled={isLoading || event.availableTickets === 0}
      >
        {event.availableTickets === 0
          ? "Sold Out"
          : isLoading
          ? "Booking..."
          : "Proceed to Checkout"}
      </button>
    </div>
  );
};

export default BookEvent;
