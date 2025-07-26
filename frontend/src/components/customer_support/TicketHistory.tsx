import { useSelector } from "react-redux";
import { customerSupportAPI } from "../../Features/customerSupport/customerSupportAPI";
import type { RootState } from "../../app/store";

const TicketHistory = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.userID;
  const { data, isLoading, isError } = customerSupportAPI.useGetSupportTicketsByUserIdQuery(userId ?? 0, {
            skip: !userId, 
            refetchOnMountOrArgChange: true,
            pollingInterval: 60000,
        });

  const statusBadgeClass: Record<string, string> = {
   Open: "badge-warning",
   InProgress: "badge-info",
   Resolved: "badge-success",
   Closed: "badge-info",
  };

  if (isLoading) return <p>Loading ticket history...</p>;
  if (isError || !data?.data) return <p>Could not load ticket history.</p>;

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Your Ticket History</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((ticket) => (
              <tr key={ticket.ticketID}>
                <td>{ticket.ticketID}</td>
                <td>{ticket.subject}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketHistory;
