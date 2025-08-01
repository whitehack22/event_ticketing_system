import { eventsAPI, type TEvent } from "../../../../Features/events/eventsAPI";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import CreateEvent from "./CreateEvent";
import UpdateEvent from "./UpdateEvent";
import DeleteEvent from "./DeleteEvent";

const Events = () => {
  const { data: eventsData, isLoading, error } = eventsAPI.useGetEventsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [selectedEvent, setSelectedEvent] = useState<TEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<TEvent | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleEdit = (event: TEvent) => {
    setSelectedEvent(event);
    (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="p-4">
      {/* Create Event Button */}
      <div className="flex justify-end mb-4">
        <button
          data-testid="open-create-event-modal"
          className="btn bg-gray-700 text-white hover:bg-gray-800"
          onClick={() => (document.getElementById("my_modal_5") as HTMLDialogElement)?.showModal()}
        >
          Create Event
        </button>
      </div>

      {/* Modals */}
      <CreateEvent />
      <UpdateEvent event={selectedEvent} />
      <DeleteEvent event={eventToDelete} />

      {/* Image Preview Modal */}
      {selectedImage && (
        <dialog id="image_modal" className="modal" open>
          <div className="modal-box max-w-3xl">
            <img src={selectedImage} alt="Event Full Size" className="w-full rounded" />
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setSelectedImage(null);
                  (document.getElementById("image_modal") as HTMLDialogElement)?.close();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Table Display */}
      {isLoading && <p>Loading events...</p>}
      {error && <p className="text-red-500">Error fetching events</p>}

      {eventsData?.data?.length ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Category</th>
                <th>Tickets</th>
                <th>Price</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {eventsData.data.map((event) => (
                <tr key={event.eventID} className="hover:bg-gray-100">
                  <td>{event.eventID}</td>
                  <td>
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        alt="Event Thumbnail"
                        className="w-16 h-16 object-cover rounded cursor-pointer border"
                        onClick={() => {
                          setSelectedImage(event.image_url);
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </td>
                  <td>{event.title}</td>
                  <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td>{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{event.category}</td>
                  <td>
                    {event.availableTickets} / {event.totalTickets}
                  </td>
                  <td>{event.ticketPrice}</td>
                  <td>
                    <span
                      className={`badge ${event.isActive ? "badge-success" : "badge-error"}`}
                    >
                      {event.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                  {new Date(event.createdAt).toLocaleString("en-GB", {
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
                  {new Date(event.updatedAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                    timeZone: "Africa/Nairobi", // Force EAT
                  })}
                </td>
                  <td className="flex gap-2">
                    <button
                      data-testid="edit-event-button"
                      className="btn btn-sm btn-primary mr-4 text-blue-500"
                      onClick={() => handleEdit(event)}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger text-red-500"
                      onClick={() => {
                        setEventToDelete(event);
                        (document.getElementById("delete_modal") as HTMLDialogElement)?.showModal();
                      }}
                    >
                      <MdDeleteForever size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
};

export default Events;
