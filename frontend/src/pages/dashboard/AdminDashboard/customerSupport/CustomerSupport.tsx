import { customerSupportAPI, type TCustomerSupport } from "../../../../Features/customerSupport/customerSupportAPI";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import UpdateStatus from "./UpdateStatus";
import DeleteTicket from "./DeleteTicket";

const CustomerSupport = () => {
  const { data: supportData, isLoading, error } = customerSupportAPI.useGetSupportTicketsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 60000,
  });

  const statusBadgeClass: Record<string, string> = {
  Open: "badge-warning",
  InProgress: "badge-info",
  Resolved: "badge-success",
  Closed: "badge-info",
};

  const [selectedTicket, setSelectedTicket] = useState<TCustomerSupport | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<TCustomerSupport | null>(null);
 

  const handleEdit = (ticket: TCustomerSupport) => {
    setSelectedTicket(ticket);
    (document.getElementById("update_modal") as HTMLDialogElement)?.showModal();
  };

  return (
    <div className="p-4">

      {/* Modals */}
      <UpdateStatus ticket={selectedTicket} />
      <DeleteTicket ticket={ticketToDelete} />

      {/* Table Display */}
      {isLoading && <p>Loading tickets...</p>}
      {error && <p className="text-red-500">Error fetching tickets</p>}

      {supportData?.data?.length ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-700 text-white">
              <tr>
                <th>Ticket ID</th>
                <th>User ID</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {supportData.data.map((ticket) => (
                <tr key={ticket.ticketID} className="hover:bg-gray-100">
                  <td>{ticket.ticketID}</td>
                  <td>{ticket.userID}</td>
                  <td>{ticket.email}</td>
                  <td>{ticket.subject}</td>
                  <td>{ticket.description}</td>
                  <td>
                <span className={`badge ${statusBadgeClass[ticket.status] || "badge-ghost"}`}>
                    {ticket.status}
                </span>
                </td>
                  <td>
                  {new Date(ticket.createdAt).toLocaleString("en-GB", {
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
                  {new Date(ticket.updatedAt).toLocaleString("en-GB", {
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
                      onClick={() => handleEdit(ticket)}
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger text-red-500"
                      onClick={() => {
                        setTicketToDelete(ticket);
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
        <p>No Support Tickets found.</p>
      )}
    </div>
  );
};

export default CustomerSupport;
