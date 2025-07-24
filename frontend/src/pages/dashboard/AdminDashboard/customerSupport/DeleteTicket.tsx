import { toast } from "sonner";
import { customerSupportAPI, type TCustomerSupport } from "../../../../Features/customerSupport/customerSupportAPI";

type DeleteTicketProps = {
    ticket: TCustomerSupport | null;
};

const DeleteTicket = ({ ticket }: DeleteTicketProps) => {
    const [deleteTicket, { isLoading }] = customerSupportAPI.useDeleteSupportTicketMutation(
        { fixedCacheKey: "deleteTicket" } 
    );

    const handleDelete = async () => {
        try {
            if (!ticket) {
                toast.error("No ticket selected for deletion.");
                return;
            }
            await deleteTicket(ticket.ticketID);
            toast.success("Ticket deleted successfully!");
            (document.getElementById('delete_modal') as HTMLDialogElement)?.close();

        } catch (error) {
            console.error("Error deleting ticket:", error);
            toast.error("Failed to delete ticket. Please try again.");

        }
    };

    return (
        <dialog id="delete_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">

                <h3 className="font-bold text-lg mb-4">Delete Customer Support Ticket</h3>
                <p className="mb-6">
                    Are you sure you want to delete <span className="font-semibold">{ticket?.ticketID}</span>?
                </p>
                <div className="modal-action flex gap-4">
                    <button
                        className="btn btn-error"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="loading loading-spinner text-primary" /> Deleting...
                            </>
                        ) : "Yes, Delete"}
                    </button>
                    <button
                        className="btn"
                        type="button"
                        onClick={() => (document.getElementById('delete_modal') as HTMLDialogElement)?.close()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default DeleteTicket;