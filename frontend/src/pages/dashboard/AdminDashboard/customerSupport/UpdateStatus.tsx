import { useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { customerSupportAPI, type TCustomerSupport } from "../../../../Features/customerSupport/customerSupportAPI";
import { toast } from "sonner";
import { useEffect } from "react";

type UpdateStatusProps = {
    ticket: TCustomerSupport | null;
};

type UpdateStatusInputs = {
    status: "Open" | "In Progress" | "Resolved" | "Closed";
};

const schema = yup.object({
    status: yup.string().oneOf(["Open", "In Progress", "Resolved", "Closed"]).required("Status is required"),
});

const UpdateStatus = ({ ticket }: UpdateStatusProps) => {
    const [updateCustomerSupport, { isLoading }] = customerSupportAPI.useUpdateSupportTicketMutation(
        { fixedCacheKey: "updateCustomerSupport" }
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<UpdateStatusInputs>({
        resolver: yupResolver(schema),
        defaultValues: {
            status: ticket ? (ticket.status as "Open" | "In Progress" | "Resolved" | "Closed") : "Closed",
        },
    });

    // Update form value when status changes
    // (so the modal always shows the correct status)
    useEffect(() => {
        if (ticket) {
            setValue("status", ticket.status as "Open" | "In Progress" | "Resolved" | "Closed"); 
        } else {
            reset();
        }
    }, [ticket, setValue, reset]);

    const onSubmit: SubmitHandler<UpdateStatusInputs> = async (data) => {
        try {
            if (!ticket) {
                toast.error("No value selected for status change.");
                return;
            }
            await updateCustomerSupport({
            ticketID: ticket.ticketID,
            status: data.status,
            email: ticket.email,
            subject: ticket.subject,
            })
            toast.success("Status updated successfully!");
            reset();
            (document.getElementById('update_modal') as HTMLDialogElement)?.close();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status. Please try again.");
        }
    };

    return (
        <dialog id="update_modal" className="modal sm:modal-middle">
            <div className="modal-box bg-gray-600 text-white w-full max-w-xs sm:max-w-lg mx-auto rounded-lg">
                <h3 className="font-bold text-lg mb-4">
                    Change Status for {ticket?.ticketID}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <label className="text-white font-semibold">Select Status:</label>
                    <select
                        {...register("status")}
                        className="select select-bordered w-full bg-white text-black dark:bg-gray-200 dark:text-black"
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                    {errors.status && (
                        <span className="text-sm text-red-700">{errors.status.message}</span>
                    )}

                    <div className="modal-action flex flex-col sm:flex-row gap-2">
                        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner text-primary" /> Updating...
                                </>
                            ) : "Update Status"}
                        </button>
                        <button
                            className="btn w-full sm:w-auto"
                            type="button"
                            onClick={() => {
                                (document.getElementById('update_modal') as HTMLDialogElement)?.close();
                                reset();
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

export default UpdateStatus;