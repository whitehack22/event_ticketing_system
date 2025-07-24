import { venuesAPI, type TVenue } from "../../../../Features/venues/venuesAPI";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import CreateVenue from "./CreateVenue";
import UpdateVenue from "./UpdateVenue";
import DeleteVenue from "./DeleteVenue";

const Venues = () => {
  const { data: venuesData, isLoading, error } = venuesAPI.useGetVenuesQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const [selectedVenue, setSelectedVenue] = useState<TVenue | null>(null);
  const [venueToDelete, setVenueToDelete] = useState<TVenue | null>(null);

  const handleEdit = (venue: TVenue) => {
    setSelectedVenue(venue);
    (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="p-4">
      {/* Create Venue Button */}
      <div className="flex justify-end mb-4">
        <button
          className="btn bg-gray-700 text-white hover:bg-gray-800"
          onClick={() => (document.getElementById("my_modal_5") as HTMLDialogElement)?.showModal()}
        >
          Create Venue
        </button>
      </div>

      {/* Modals */}
      <CreateVenue />
      <UpdateVenue venue={selectedVenue} />
      <DeleteVenue venue={venueToDelete} />

      {/* Table Display */}
      {isLoading && <p>Loading venues...</p>}
      {error && <p className="text-red-500">Error fetching venues</p>}

      {venuesData?.data?.length ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Capacity</th>
                <th>Contact Number</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {venuesData.data.map((venue) => (
                <tr key={venue.venueID} className="hover:bg-gray-100">
                  <td>{venue.venueID}</td>
                  <td>{venue.name}</td>
                  <td>{venue.address}</td>
                  <td>{venue.capacity}</td>
                  <td>{venue.contactNumber}</td>
                  <td>
                  {new Date(venue.createdAt).toLocaleString("en-GB", {
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
                      className="btn btn-sm btn-primary mr-4 text-blue-500"
                      onClick={() => handleEdit(venue)}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger text-red-500"
                      onClick={() => {
                        setVenueToDelete(venue);
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
        <p>No venues found.</p>
      )}
    </div>
  );
};

export default Venues;
