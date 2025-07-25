import { Link } from "react-router-dom";
import { type TEvent } from "../../Features/events/eventsAPI";
import { type TVenue } from "../../Features/venues/venuesAPI";

type Props = {
  event: TEvent;
  venue?: TVenue;
};

const EventCard = ({ event, venue }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Section */}
      <img
        src={event.image_url || "https://via.placeholder.com/300x200"}
        alt={event.title}
        className="w-full h-48 object-cover"
      />

      {/* Info Section */}
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
        <p className="text-sm text-gray-500 italic">{event.category}</p>

        <div className="text-sm">
          <p>
            <strong>Date:</strong>{" "}
            {new Date(event.eventDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Time:</strong> {event.startTime} - {event.endTime}
          </p>
          {venue && (
            <p>
              <strong>Venue:</strong> {venue.name}, {venue.address}
            </p>
          )}
          <p>
            <strong>Ticket Price:</strong> Ksh {event.ticketPrice}
          </p>
          <p>
            <strong>Available Tickets:</strong> {event.availableTickets}
          </p>
        </div>

        <Link
          to={`/bookings/${event.eventID}`}
          className="inline-block w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
